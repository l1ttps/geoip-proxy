import { Elysia } from "elysia";
import * as maxmind from "maxmind";

// Path to the MMDB file from the volume
const MMDB_PATH = "/usr/share/GeoIP/GeoLite2-City.mmdb";

let lookup: maxmind.Reader<any> | null = null;

// Load the database when the server starts
(async () => {
  try {
    lookup = await maxmind.open(MMDB_PATH);
    console.log("✅ GeoIP database loaded successfully");
  } catch (error) {
    console.error("❌ Failed to load GeoIP database:", error);
  }
})();

const app = new Elysia()
  .get("/:ip", ({ params }) => {
    if (!lookup) {
      return { error: "GeoIP database not loaded" };
    }

    const ipInfo = lookup.get(params.ip);
    return ipInfo || { error: "IP not found" };
  })
  .listen(parseInt(process.env.PORT || "3000", 10));

console.log(
  `🦊 GeoIP Proxy is running at http://localhost:${app.server?.port}`
);
