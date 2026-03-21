# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build & Run Commands

- **Dev mode**: `bun run --watch src/index.ts` (auto-reload on changes)
- **Build**: `bun build --compile --minify --target bun --outfile server ./src/index.ts` (creates standalone binary)
- **Start**: `./server` (runs compiled binary)
- **Docker**: `docker-compose up` (requires .env with PORT)

## Critical Architecture Notes

- **Database path hardcoded**: GeoIP databases must be at `/usr/share/GeoIP/` (see [`src/configs/pathDatabase.ts`](src/configs/pathDatabase.ts:1))
- **Retry mechanism**: [`loadDatabase()`](src/services/geoip.service.ts:27) retries indefinitely until database loads (1s delay)
- **No test framework**: `npm test` exits with error - no tests implemented
- **Daily Docker build**: GitHub Actions rebuilds daily with fresh GeoIP databases

## Code Style

- TypeScript strict mode enabled
- ES2021 target, ES2022 modules
- Use `bun-types` for Bun-specific APIs
- Elysia framework for HTTP routing
- MaxMind library for GeoIP lookups

## Non-Obvious Patterns

- **Bulk endpoint**: `/bulk/:ips` accepts comma-separated IPs (e.g., `/bulk/1.2.3.4,5.6.7.8`)
- **IP detection**: Root endpoint `/` returns client IP via `app.server.requestIP()`
- **Database loading**: All 3 databases (City, Country, ASN) must load before serving requests
- **Error handling**: Returns `{ error: string }` for missing IPs or unloaded databases
- **Docker secrets**: Requires `GEOIPUPDATE_ACCOUNT_ID` and `GEOIPUPDATE_LICENSE_KEY` build args

## Environment Variables

- `PORT`: Server port (default: 4360)
- `GEOIPUPDATE_ACCOUNT_ID`: MaxMind account ID (Docker build only)
- `GEOIPUPDATE_LICENSE_KEY`: MaxMind license key (Docker build only)
