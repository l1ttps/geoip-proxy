import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello GeoIp Proxy")
  .listen(parseInt(process.env.PORT || "3000", 10));

console.log(
  `🦊 GeoIP Proxy is running at ${app.server?.hostname}:${app.server?.port}`
);
