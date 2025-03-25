import { Elysia } from "elysia";
import GeoIpController from "./controllers/geoip.controller";

const app = new Elysia();
app.use(GeoIpController);
app.listen(parseInt(process.env.PORT || "3000", 10));

console.log(
  `🦊 GeoIP Proxy is running at http://localhost:${app.server?.port}`
);
