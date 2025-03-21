import { Elysia } from "elysia";
import * as maxmind from "maxmind";

const basePath = "/usr/share/GeoIP/";
const MMDB_CITY = basePath + "GeoLite2-City.mmdb";
const MMDB_COUNTRY = basePath + "GeoLite2-Country.mmdb";
const MMDB_ASN = basePath + "GeoLite2-ASN.mmdb";

let lookupCity: any = null;
let lookupCountry: any = null;
let lookupASN: any = null;

async function loadDatabase(path: string) {
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

(async () => {
  lookupCity = await loadDatabase(MMDB_CITY);
  console.log("✅ GeoLite2-City database loaded successfully");

  lookupCountry = await loadDatabase(MMDB_COUNTRY);
  console.log("✅ GeoLite2-Country database loaded successfully");

  lookupASN = await loadDatabase(MMDB_ASN);
  console.log("✅ GeoLite2-ASN database loaded successfully");
})();

const app = new Elysia()
  .get("/:ip", ({ params }) => {
    if (!lookupCity || !lookupCountry || !lookupASN) {
      return { error: "GeoIP databases not fully loaded" };
    }

    const cityInfo = lookupCity.get(params.ip);
    const countryInfo = lookupCountry.get(params.ip);
    const asnInfo = lookupASN.get(params.ip);

    if (!cityInfo && !countryInfo && !asnInfo) {
      return { error: "IP not found" };
    }

    return {
      query: params.ip,
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
  })
  .listen(parseInt(process.env.PORT || "3000", 10));

console.log(
  `🦊 GeoIP Proxy is running at http://localhost:${app.server?.port}`
);
