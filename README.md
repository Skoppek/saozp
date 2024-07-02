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

#### Wykonanie migracji bazy danych

Wygenerowanie plików migracji

```bash
bunx drizzle-kit generate
```

Wprowadzenie migracji do bazy danych

```bash
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

```bash
docker-compose up -d --build --remove-orphans
```

```bash
docker run \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_USER=postgres \
-e POSTGRES_DB=saozp \
-v ./psql:/var/lib/postgresql/data \
-p 5000:5432 \
-d postgres
```

## Testy obciążeniowe

Testy obciążeniowe znajdują się w katalogu `load-tests`.
Dostępny jest jeden test polegający na wysłaniu kodu sumującego liczby od 1 do podanej w konfiguracji w sekcji `variables`.
Wynik jest sprawdzany względem ustawionej wartości `sum`.

Aby uruchomić testy należy użyć poniższej komendy:

```bash
artillery run -q -e <środwisko> -o <wynik>.json tests/sum_test.yaml
```

gdzie należy wskazać w jakim języku wysyłać zadania [c, java, python] w polu `środowisko`.
Wyniki testów zostaną zapisane w pliku `wynik`.json.

Aby usyskać raport w pliku html należy użyć poniższej komendy.

```bash
artillery report <wynik>.json
```

## TODO

- ładowanie testów plikami
- reset hasła przez admina
- tworzenie grup zajęciowych
- grupowanie problemów w konkursy
- przypisanie użytkowników do konkursów
- statystyka wyników
- ponowne uruchamianie testów na rozwiązaniach
