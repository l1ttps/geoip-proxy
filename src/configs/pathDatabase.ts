export default process.env.GEOIP_DB_PATH || "/usr/share/GeoIP/";

// Candidate filenames per database, in priority order. DB-IP Lite is the
// default; GeoLite2 is kept as a fallback for setups that mount their own files.
export const databaseFiles = {
  city: ["dbip-city-lite.mmdb", "GeoLite2-City.mmdb"],
  asn: ["dbip-asn-lite.mmdb", "GeoLite2-ASN.mmdb"],
};
