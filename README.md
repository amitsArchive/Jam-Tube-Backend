# Jam — Backend API

REST and WebSocket backend for **Jam**, a collaborative music listening platform. Clients create or join rooms, search YouTube tracks, manage a shared queue, and synchronize playback in real time.

Built with **Spring Boot 3** and **STOMP over SockJS**.

---

## Features

- **Room lifecycle** — Create sessions with short room codes, join by code, end session (host), remove members (host)
- **Real-time sync** — STOMP messaging for member roster, queue updates, and playback events (play, pause, seek)
- **Shared queue** — Add tracks, skip to next (with idempotent skip when multiple clients detect track end)
- **YouTube search** — Server-side search via YouTube Data API v3 (API key never exposed to browsers)
- **Session cleanup** — Automatic room deletion when the last member disconnects

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Runtime | Java 21 |
| Framework | Spring Boot 3.5 |
| API | Spring Web (REST) |
| Real-time | Spring WebSocket, STOMP, SockJS |
| Persistence | Spring Data JPA, H2 (in-memory) |
| HTTP client | Spring WebFlux `RestClient` |
| Build | Maven |

---

## Prerequisites

- **JDK 21** or newer
- **Maven 3.9+** (or use the included `./mvnw` wrapper)
- **YouTube Data API v3** key ([Google Cloud Console](https://console.cloud.google.com/apis/credentials))

---

## Quick start

### 1. Clone and configure

```bash
git clone https://github.com/amitsArchive/Jam-Tube-Backend
cd demo
cp .env.example .env
```

Set `YOUTUBE_API_KEY` in `.env` or export it in your shell. Do not commit `.env`.

### 2. Run the application

**Windows (PowerShell):**

```powershell
$env:YOUTUBE_API_KEY = "your_api_key_here"
.\mvnw.cmd spring-boot:run
```

**macOS / Linux:**

```bash
export YOUTUBE_API_KEY=your_api_key_here
./mvnw spring-boot:run
```

The server starts at **`http://localhost:8080`**.

### 3. Verify

```bash
curl http://localhost:8080/api/ping
```

Expected response: `Server is awake!`

---

## Configuration

### Application properties

| File | Purpose |
|------|---------|
| `src/main/resources/application.properties` | Local development defaults |
| `src/main/resources/application-prod.properties` | Production profile (`prod`) |

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `YOUTUBE_API_KEY` | Yes | YouTube Data API v3 key |
| `SPRING_PROFILES_ACTIVE` | Production | Set to `prod` when deploying |
| `APP_CORS_ALLOWED_ORIGINS` | Production | Comma-separated frontend origins (e.g. `https://jam.example.com`) |

### CORS and WebSocket origins

Allowed browser origins are configured via:

```properties
app.cors.allowed-origins=http://localhost:5173,http://127.0.0.1:5173
```

In production (`prod` profile), this value is supplied by `APP_CORS_ALLOWED_ORIGINS`. The same list applies to REST (`/api/**`) and the SockJS endpoint (`/ws`).

### Local H2 console

The H2 console is enabled in the default profile at `/h2-console`. It is **disabled** in the `prod` profile. Do not expose the console on a public server.

---

## API reference

Base URL: `http://localhost:8080`

### REST

#### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/ping` | Health check |

#### Rooms

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/rooms/create` | Create a room |
| `GET` | `/api/rooms/{roomId}` | Get room state (members, queue) |
| `POST` | `/api/rooms/{roomId}/end?hostUsername={name}` | End session (host only) |
| `POST` | `/api/rooms/{roomId}/remove/{username}?hostUsername={name}` | Remove a member (host only) |

**Create room** — request body:

```json
{
  "hostUsername": "alice"
}
```

**Response** — `JamRoom` example:

```json
{
  "roomId": "A1B2C3",
  "hostUsername": "alice",
  "users": ["alice"],
  "queue": []
}
```

#### Search

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| `GET` | `/api/search` | `search={query}` | Search YouTube (max 5 results) |

**Response** — array of:

```json
{
  "videoId": "dQw4w9WgXcQ",
  "title": "Example Title",
  "thumbnail": "https://..."
}
```

### WebSocket (STOMP)

**Endpoint:** `http://localhost:8080/ws` (SockJS)

| Subscribe (receive) | Publish (send) | Payload | Description |
|---------------------|----------------|---------|-------------|
| `/topic/room/{roomId}` | `/app/room/{roomId}/join` | `{ "username": "bob" }` | Join room; returns member list |
| `/topic/room/{roomId}/queue` | `/app/room/{roomId}/queue/add` | `QueueVideo` | Add track to queue |
| `/topic/room/{roomId}/queue` | `/app/room/{roomId}/queue/next` | `{ "videoId": "..." }` (optional) | Skip current track |
| `/topic/room/{roomId}/play` | `/app/room/{roomId}/play` | `PlaybackEvent` | Mirror play / pause / seek |
| `/topic/room/{roomId}/status` | — | — | Session ended broadcast |
| `/topic/room/{roomId}/kick` | — | — | User kicked notification |

**PlaybackEvent** fields:

```json
{
  "action": "play | pause | seek",
  "timestamp": 42.5,
  "videoId": "dQw4w9WgXcQ",
  "username": "alice"
}
```

**QueueVideo** extends search result with:

```json
{
  "videoId": "...",
  "title": "...",
  "thumbnail": "...",
  "queueId": "uuid",
  "addedBy": "alice"
}
```

---

## Project structure

```
src/main/java/com/example/demo/
├── DemoApplication.java          # Entry point
├── config/
│   ├── CorsConfig.java           # REST CORS
│   ├── WebSocketConfig.java      # STOMP / SockJS
│   ├── WebSocketEventListener.java
│   └── RestClientConfig.java     # YouTube API client
├── controller/
│   ├── RoomRestController.java   # REST room APIs
│   ├── RoomController.java       # STOMP message handlers
│   ├── SearchController.java
│   └── HealthController.java
├── entity/                       # JPA models & DTOs
├── repository/
│   └── JamRoomRepository.java
└── service/
    ├── JamSessionService.java
    └── YoutubeSearchService.java
```

---

## Development

### Run tests

```bash
./mvnw test
```

### Build JAR

```bash
./mvnw clean package -DskipTests
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### Package for production

```bash
export SPRING_PROFILES_ACTIVE=prod
export YOUTUBE_API_KEY=your_key
export APP_CORS_ALLOWED_ORIGINS=https://your-frontend.example.com
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting notes (including the separate React client in `jam-frontend/`).

---

## Production deployment

1. Set `SPRING_PROFILES_ACTIVE=prod`
2. Set `YOUTUBE_API_KEY` and `APP_CORS_ALLOWED_ORIGINS`
3. Serve the API over **HTTPS** (SockJS requires secure transports in production)
4. Restrict your YouTube API key by IP or referrer in Google Cloud Console
5. Consider **PostgreSQL** instead of in-memory H2 for persistent rooms across restarts

---

## Security notes (MVP)

This release is intended for demos and portfolio use. Be aware of the following:

- **No authentication** — Room codes and display names are the only access control.
- **Host actions** — End session and kick are validated by matching `hostUsername` strings, not signed tokens.
- **Open rooms** — Anyone with a room code can publish playback and queue messages over WebSocket.
- **In-memory data** — All state is lost when the process restarts (H2 `mem` database).

Do not deploy to the public internet without understanding these limitations. See [DEPLOYMENT.md](./DEPLOYMENT.md) for a full checklist.

---

## License

 All rights reserved.
