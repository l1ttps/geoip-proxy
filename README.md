# 🌍 GeoIP Proxy

GeoIP Proxy is a simple service that provides IP geolocation data using MaxMind's GeoLite2 database.

## 🚀 Run with Docker

The Docker image is built daily with the latest GeoLite2 databases. To run the service using Docker, simply run:

```sh
docker run -e PORT=4360 -p 4360:4360 ghcr.io/l1ttps/geoip-proxy:latest
```

## 🌐 Access the API

Once the service is running, you can access it by opening a web browser or using `curl`:

```
http://localhost:4360/141.101.64.0
```

Example using `curl`:

```sh
curl http://localhost:4360/141.101.64.0
```

## 📜 Example Response

Upon a successful request, the API returns a JSON response containing IP geolocation details:

```json
{
  "query": "141.101.64.0",
  "status": "success",
  "continent": "Europe",
  "continentCode": "EU",
  "country": "The Netherlands",
  "countryCode": "NL",
  "region": "NH",
  "regionName": "North Holland",
  "city": "Amsterdam",
  "district": "",
  "zip": "1012",
  "lat": 52.3759,
  "lon": 4.8975,
  "timezone": "Europe/Amsterdam",
  "offset": 20,
  "currency": "",
  "isp": "Cloudflare Inc",
  "org": "Cloudflare Inc",
  "as": "AS202623 Cloudflare Inc",
  "asname": "Cloudflare Inc"
}
```

## 📜 License

This project uses the GeoLite2 data created by MaxMind, available from [MaxMind](https://www.maxmind.com).

## 📞 Support

For any issues or questions, please create an issue in the [GitHub repository](https://github.com/l1ttps/geoip-proxy/issues).
