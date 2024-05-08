# SAOZP

**_System Automatycznego Oceniania Zadań Programistycznych_**

## Backend

```bash
cd ./backend
bun i
```

Część serwerowa korzysta z:

- ElysiaJS - serwer HTTP
- DrizzleORM - zarządzanie bazą danych

Bazę danych można obejrzeć przez przeglądarkę korzystając z narzędzia **Drizzle Studio**

```bash
bunx drizzle-kit studio
```

Uruchomienie serwera ElysiaJS

```bash
bun run dev
```

Wykonanie migracji bazy danych

```bash
bunx drizzle-kit generate:pg
...
bunx drizzle-kit push:pg
```

## Frontend

```bash
cd ./frontend
bun i
```

Część frontendowa korzysta z Reacta.

```bash
bun run dev
```

[Ikony do strony](https://react-icons.github.io/react-icons/icons/hi/)

## TODO

- usuwanie starych testów własnych użytkownika (max 1 na problem, pozostałe powinny być tylko oficjalne próby)
