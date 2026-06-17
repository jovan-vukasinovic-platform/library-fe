# library-fe — Biblioteka (Angular)

Angular 17 (standalone komponente) frontend za katalog knjiga. CRUD nad `application-be` API-jem.

## Lokalno pokretanje

```bash
npm install
npm start        # ng serve sa proxy-jem: /api -> http://localhost:8080
```

Aplikacija: http://localhost:4200 (bekend mora biti pokrenut na :8080).

## Build (production)

```bash
npm run build
# Output: dist/library-fe/browser  (vazno za Dockerfile/Nginx)
```

## API konfiguracija

- `src/environments/environment.ts` (production): `apiUrl: '/api'` — u klasteru FE i BE
  dele isti ingress, pa su pozivi same-origin i nema CORS problema.
- `src/environments/environment.development.ts` + `proxy.conf.json`: dev rezim,
  proxy prosledjuje `/api` na `localhost:8080`.

## Strane

- `/` — lista knjiga (status čipovi: Dostupna / Pozajmljena / Rezervisana, izmena, brisanje)
- `/books/new` — dodavanje knjige
- `/books/:id/edit` — izmena knjige
