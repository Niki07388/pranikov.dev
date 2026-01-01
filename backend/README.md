# Portfolio Backend (Spring Boot)

Tech:
- Java 17
- Maven
- Spring Web
- Spring Data JPA
- Lombok
- PostgreSQL

## Use local PostgreSQL (no Docker)
Make sure your local PostgreSQL service is running, then set the DB env vars to match your local credentials.

PowerShell example:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/portfolio"
$env:DB_USER = "postgres"   # or your local DB user
$env:DB_PASSWORD = "<your password>"
```

Notes:
- The app supports `DB_USER` and `DB_USERNAME` (either is fine).
- If your database name/user/port differ, adjust `DB_URL` accordingly.

## Run PostgreSQL (Docker) (optional)
If you do want Docker later, from this folder:

```bash
docker compose up -d
```

## Run the API

```bash
mvn spring-boot:run
```

API base URL: `http://localhost:8080`

### Endpoints
- `GET /api/health`
- `POST /api/contact`
- `GET /api/contact`
- `GET /api/contact/{id}`
- `DELETE /api/contact/{id}`

### CORS (for Vite)
Defaults to allowing `http://localhost:5173`.
Override with:
- `CORS_ALLOWED_ORIGINS` (comma-separated)

### DB config env vars
- `DB_URL` (default `jdbc:postgresql://localhost:5432/portfolio`)
- `DB_USER` / `DB_USERNAME` (default `portfolio`)
- `DB_PASSWORD` (default `portfolio`)
- `JPA_DDL_AUTO` (default `update`)
