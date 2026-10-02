# Documently — dokumentacja użytkownika

## Cel
Documently pomaga przeszukiwać dokumenty i zadawać pytania dotyczące ich treści. Interfejs jest responsywny i obsługuje klawiaturę oraz czytniki ekranu.

## Szybki start
1. Otwórz **Aplikację**.
2. Utwórz przestrzeń roboczą.
3. Dodaj pliki PDF.
4. Otwórz zakładkę **Rozmowa** i wpisz pytanie.
5. Zweryfikuj odpowiedź w źródle, zanim wykorzystasz ją w pracy.

## Dostępność
- Wszystkie funkcje są dostępne z klawiatury.
- Elementy mają etykiety, role i stany ARIA.
- Kontrast jest zgodny z WCAG 2.2 AA.
- Interfejs respektuje `prefers-reduced-motion`.

## Błędy
Błędy interfejsu i odrzucone operacje są przechwytywane globalnie. Komunikat zawiera prostą wskazówkę, kontekst i skrócony identyfikator zdarzenia. Nie pokazujemy użytkownikowi sekretów ani stosu wywołań.

## Dane i bezpieczeństwo
Wdrożenie produkcyjne powinno wymuszać RLS w Supabase, walidować typ i rozmiar pliku po stronie serwera oraz przechowywać klucze wyłącznie w zmiennych środowiskowych.
