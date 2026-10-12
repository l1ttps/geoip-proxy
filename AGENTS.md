# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build & Run Commands

- **Dev mode**: `bun run --watch src/index.ts` (auto-reload on changes)
- **Build**: `bun build --compile --minify --target bun --outfile server ./src/index.ts` (creates standalone binary)
- **Start**: `./server` (runs compiled binary)
- **Docker**: `docker-compose up` (requires .env with PORT)

## Critical Architecture Notes

- **Database source**: free DB-IP Lite MMDB (City + ASN), downloaded in the Dockerfile from `download.db-ip.com/free/` with no credentials; falls back to the previous month if the current release isn't out yet
- **Database path**: `/usr/share/GeoIP/` by default, overridable via `GEOIP_DB_PATH` (see [`src/configs/pathDatabase.ts`](src/configs/pathDatabase.ts:1)). Each DB tries `dbip-*-lite.mmdb` first, then legacy `GeoLite2-*.mmdb`
- **Retry mechanism**: [`loadDatabase()`](src/services/geoip.service.ts:18) retries indefinitely until database loads (1s delay)
- **No test framework**: `npm test` exits with error - no tests implemented
- **Daily Docker build**: GitHub Actions rebuilds daily; DB-IP publishes monthly, and the README date line only changes when the DB `build_epoch` changes

## Code Style

- TypeScript strict mode enabled
- ES2021 target, ES2022 modules
- Use `bun-types` for Bun-specific APIs
- Elysia framework for HTTP routing
- `maxmind` library for MMDB lookups (DB-IP Lite uses a GeoLite2-compatible schema)
- `@photostructure/tz-lookup` derives `timezone` from coordinates (DB-IP Lite has no time zone)

## Non-Obvious Patterns

- **Bulk endpoint**: `/bulk/:ips` accepts comma-separated IPs (e.g., `/bulk/1.2.3.4,5.6.7.8`)
- **IP detection**: Root endpoint `/` returns client IP via `app.server.requestIP()`
- **Database loading**: Both databases (City, ASN) must load before serving requests; country/continent come from the City DB
- **Backward compatibility**: Response shape mirrors ip-api.com and must not change; fields DB-IP Lite lacks (`region`, `zip`, `district`, `currency`) are returned as `""`
- **Error handling**: Returns `{ error: string }` for missing IPs or unloaded databases

## Environment Variables

- `PORT`: Server port (default: 4360)
- `GEOIP_DB_PATH`: Directory containing the `.mmdb` files (default: `/usr/share/GeoIP/`)
