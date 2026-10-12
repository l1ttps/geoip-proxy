import tzlookup from "@photostructure/tz-lookup";
import { existsSync } from "fs";
import * as maxmind from "maxmind";
import pathDatabase, { databaseFiles } from "../configs/pathDatabase";
import { IPGeolocation } from "../type";
export class GeoIpService {
  lookupCity: any = null;
  lookupASN: any = null;
  constructor() {
    this.syncDatabase();
  }

  async syncDatabase() {
    this.lookupCity = await this.loadDatabase(databaseFiles.city);
    this.lookupASN = await this.loadDatabase(databaseFiles.asn);
  }

  async loadDatabase(files: string[]) {
    while (true) {
      const path = files
        .map((file) => pathDatabase + file)
        .find((path) => existsSync(path));
      try {
        if (!path) throw new Error(`none of ${files.join(", ")} found`);
        const reader = await maxmind.open(path);
        console.log(
          `✅ ${reader.metadata.databaseType} database loaded successfully from ${path}`
        );
        return reader;
      } catch (error) {
        console.error(
          `❌ Failed to load ${path || files[0]}, retrying in 1 second...`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  // DB-IP Lite has no time_zone, so fall back to deriving it from coordinates.
  getTimezone(location: any): string {
    if (location?.time_zone) return location.time_zone;
    if (location?.latitude == null || location?.longitude == null) return "";
    try {
      return tzlookup(location.latitude, location.longitude);
    } catch {
      return "";
    }
  }

  // UTC offset in seconds, matching ip-api's `offset` field.
  getOffset(timezone: string): number {
    if (!timezone) return 0;
    try {
      const name = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "longOffset",
      })
        .formatToParts(new Date())
        .find((part) => part.type === "timeZoneName")?.value;
      const match = name?.match(/GMT([+-])(\d{2}):(\d{2})/);
      if (!match) return 0;
      const seconds = parseInt(match[2], 10) * 3600 + parseInt(match[3], 10) * 60;
      return match[1] === "-" ? -seconds : seconds;
    } catch {
      return 0;
    }
  }

  async lookup(ip: string): Promise<IPGeolocation | { error: string }> {
    if (!this.lookupCity || !this.lookupASN) {
      return { error: "GeoIP databases not fully loaded" };
    }

    const cityInfo = this.lookupCity.get(ip);
    const asnInfo = this.lookupASN.get(ip);

    if (!cityInfo && !asnInfo) {
      return { error: "IP not found" };
    }

    const timezone = this.getTimezone(cityInfo?.location);
    const asOrg = asnInfo?.autonomous_system_organization || "";

    return {
      query: ip,
      status: "success",
      continent: cityInfo?.continent?.names?.en || "",
      continentCode: cityInfo?.continent?.code || "",
      country: cityInfo?.country?.names?.en || "",
      countryCode: cityInfo?.country?.iso_code || "",
      region: cityInfo?.subdivisions?.[0]?.iso_code || "",
      regionName: cityInfo?.subdivisions?.[0]?.names?.en || "",
      city: cityInfo?.city?.names?.en || "",
      district: cityInfo?.subdivisions?.[1]?.names?.en || "",
      zip: cityInfo?.postal?.code || "",
      lat: cityInfo?.location?.latitude || 0,
      lon: cityInfo?.location?.longitude || 0,
      timezone,
      offset: this.getOffset(timezone),
      currency: cityInfo?.country?.currency || "",
      isp: asOrg,
      org: asOrg,
      as: asnInfo?.autonomous_system_number
        ? `AS${asnInfo.autonomous_system_number} ${asOrg}`.trim()
        : "",
      asname: asOrg,
    };
  }
}
