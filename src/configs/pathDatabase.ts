import path from "path";

const { join } = path;

export default process.env.NODE_ENV === "production"
  ? "/usr/share/GeoIP/"
  : join(__dirname, "../../data/");
