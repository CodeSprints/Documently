# Documently — architektura / architecture

## Frontend
The application uses Vue 3 with TypeScript, Vite and Tailwind CSS. `App.vue` contains the accessible shell and the first workspace flow. Components should be extracted when a view grows beyond one responsibility.

Aplikacja używa Vue 3, TypeScript, Vite i Tailwind CSS. `App.vue` zawiera dostępny szkielet oraz podstawowy przepływ pracy z przestrzenią.

## Quality gates
- `npm run build` — type-check and production build.
- `npm run test` — unit tests.
- `npm run lint` — static analysis.

## Error model
`src/lib/errors.ts` converts unknown thrown values into a stable, non-sensitive `AppError`. Global listeners handle synchronous browser errors and unhandled promise rejections. A production adapter should forward events to an observability service with redaction and sampling.

## Testing policy
Test pure functions and critical flows. Add component tests for workspace creation, keyboard navigation, error announcements and document upload validation. Add Playwright smoke tests for the landing page, application entry and documentation route.

## Deployment checklist
- Configure Supabase URL and public key through environment variables.
- Enable RLS policies for every user-owned table.
- Validate PDF MIME type, size and content on the server.
- Configure CSP, HTTPS, backups and retention.
- Review accessibility with keyboard and a screen reader.
