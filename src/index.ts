import { Elysia } from "elysia";
import GeoIpController from "./controllers/geoip.controller";

const app = new Elysia();
app.use(GeoIpController);
app
  .derive((ctx) => ({
    remoteAddress: () => app.server!.requestIP(ctx.request),
  }))
  .get("/", (ctx) => {
    return {
      ip: ctx.remoteAddress()?.address,
    };
  });
app.listen(parseInt(process.env.PORT || "4360", 10));

console.log(
  `🦊 GeoIP Proxy is running at http://localhost:${app.server?.port}`
);
