# 🌍 GeoIP Proxy

GeoIP Proxy is a simple service that provides IP geolocation data using MaxMind's GeoLite2 database.

## 📥 Clone the Repository

To get started, clone the repository and navigate into the project directory:

```sh
git clone https://github.com/l1ttps/geoip-proxy.git
cd geoip-proxy
```

## ⚙️ Setup Environment Variables

Create a `.env` file in the project root with the following content:

```
GEOIPUPDATE_ACCOUNT_ID=...
GEOIPUPDATE_LICENSE_KEY=...
GEOIPUPDATE_EDITION_IDS=GeoLite2-City GeoLite2-Country GeoLite2-ASN
GEOIPUPDATE_CRON=0 2 * * 2,5
PORT=3000
```

- `GEOIPUPDATE_ACCOUNT_ID`: Your MaxMind account ID.
- `GEOIPUPDATE_LICENSE_KEY`: Your MaxMind license key.
- `GEOIPUPDATE_EDITION_IDS`: The edition IDs for GeoLite2 databases.
- `GEOIPUPDATE_CRON`: Cron schedule for geoipupdate.
- `PORT`: The port on which the service runs.

## 🚀 Run with Docker Compose

To build and start the service using Docker Compose, run:

```sh
docker compose -f 'docker-compose.yml' up -d --build
```

This will download the necessary images, build the service, and run it in detached mode.

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
