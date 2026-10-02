# Documently

Documently to responsywna aplikacja Vue 3 + TypeScript + Tailwind CSS do pracy z dokumentami.

## Stack

- Vue 3 i Composition API
- TypeScript oraz Vue Router
- Vite i Tailwind CSS
- Vitest
- Supabase jako warstwa danych dla wdrożenia produkcyjnego

## Uruchomienie

```bash
npm install
npm run dev
```

## Kontrola jakości

```bash
npm run lint
npm run test
npm run build
```

## Dokumentacja

- [Dokumentacja polska](docs/PL.md)
- [English documentation](docs/EN.md)
- [Architektura i standardy](docs/ARCHITECTURE.md)

## Standardy

Interfejs stosuje semantyczny HTML, widoczne stany focus, etykiety formularzy, komunikaty `aria-live`, obsługę klawiatury, responsywne układy oraz ograniczenie animacji dla `prefers-reduced-motion`. Globalny mechanizm obsługi błędów normalizuje nieznane wartości i nie ujawnia danych wrażliwych.
