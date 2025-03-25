import * as maxmind from "maxmind";
import pathDatabase from "../configs/pathDatabase";
import { IPGeolocation } from "../type";
export class GeoIpService {
  lookupCity: any = null;
  lookupCountry: any = null;
  lookupASN: any = null;
  constructor() {
    this.syncDatabase();
  }

  async syncDatabase() {
    this.lookupCity = await this.loadDatabase(
      pathDatabase + "GeoLite2-City.mmdb"
    );
    console.log("✅ GeoLite2-City database loaded successfully");
    this.lookupCountry = await this.loadDatabase(
      pathDatabase + "GeoLite2-Country.mmdb"
    );
    console.log("✅ GeoLite2-Country database loaded successfully");
    this.lookupASN = await this.loadDatabase(
      pathDatabase + "GeoLite2-ASN.mmdb"
    );
    console.log("✅ GeoLite2-ASN database loaded successfully");
  }

  async loadDatabase(path: string) {
    while (true) {
      try {
        return await maxmind.open(path);
      } catch (error) {
        console.error(
          `❌ Failed to load ${path}, retrying in 1 second...`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  async lookup(ip: string): Promise<IPGeolocation | { error: string }> {
    if (!this.lookupCity || !this.lookupCountry || !this.lookupASN) {
      return { error: "GeoIP databases not fully loaded" };
    }

    const cityInfo = this.lookupCity.get(ip);
    const countryInfo = this.lookupCountry.get(ip);
    const asnInfo = this.lookupASN.get(ip);

    if (!cityInfo && !countryInfo && !asnInfo) {
      return { error: "IP not found" };
    }

    return {
      query: ip,
      status: "success",
      continent: countryInfo?.continent?.names?.en || "",
      continentCode: countryInfo?.continent?.code || "",
      country: countryInfo?.country?.names?.en || "",
      countryCode: countryInfo?.country?.iso_code || "",
      region: cityInfo?.subdivisions?.[0]?.iso_code || "",
      regionName: cityInfo?.subdivisions?.[0]?.names?.en || "",
      city: cityInfo?.city?.names?.en || "",
      district: cityInfo?.subdivisions?.[1]?.names?.en || "",
      zip: cityInfo?.postal?.code || "",
      lat: cityInfo?.location?.latitude || 0,
      lon: cityInfo?.location?.longitude || 0,
      timezone: cityInfo?.location?.time_zone || "",
      offset: cityInfo?.location?.accuracy_radius || 0,
      currency: countryInfo?.country?.currency || "",
      isp: asnInfo?.autonomous_system_organization || "",
      org: asnInfo?.autonomous_system_organization || "",
      as: `AS${asnInfo?.autonomous_system_number} ${asnInfo?.autonomous_system_organization}`,
      asname: asnInfo?.autonomous_system_organization || "",
    };
  }
}
