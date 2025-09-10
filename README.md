# 🌍 GeoIP Proxy

GeoIP Proxy is a simple service that provides IP geolocation data using MaxMind's GeoLite2 database.

## 📥 Clone the Repository

To get started, clone the repository and navigate into the project directory:

```sh
git clone https://github.com/l1ttps/geoip-proxy.git
cd geoip-proxy
```

## 🚀 Run with Docker

The Docker image is built daily with the latest GeoLite2 databases. To run the service using Docker, simply run:

```sh
docker run -p 3000:3000 ghcr.io/l1ttps/geoip-proxy:latest
```

Or with a custom port:

```sh
docker run -e PORT=8080 -p 8080:8080 ghcr.io/l1ttps/geoip-proxy:latest
```

## 🛠️ Development Setup

If you want to run the service locally for development:

1. Create a `.env` file from the example:
   ```sh
   cp .env.example .env
   ```

2. Edit the `.env` file to set your desired port:
   ```
   PORT=3000
   ```

3. Install dependencies and start the service:
   ```sh
   bun install
   bun run dev
   ```

## 🌐 Access the API

Once the service is running, you can access it by opening a web browser or using `curl`:

```
http://localhost:3000/141.101.64.0
```

Example using `curl`:

```sh
curl http://localhost:3000/141.101.64.0
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
