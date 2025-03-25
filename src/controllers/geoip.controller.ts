import Elysia from "elysia";
import { GeoIpService } from "../services/geoip.service";

const geoIpService = new GeoIpService();
const GeoIpController = new Elysia({
  prefix: "",
})
  .get("/:ip", ({ params }) => {
    return geoIpService.lookup(params.ip);
  })
  .get("/bulk/:ips", ({ params }) => {
    const ips = params.ips.split(",");
    return Promise.all(ips.map((ip) => geoIpService.lookup(ip)));
  });

export default GeoIpController;
