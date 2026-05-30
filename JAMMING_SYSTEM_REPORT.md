# Jamming System Architecture & Communication Report

This report details the technical architecture and communication flow of the current "Jamming" system, which enables real-time playback synchronization between multiple users.

---

## 1. System Architecture Overview
The system follows a **Client-Server architecture** utilizing **WebSockets (STOMP protocol)** for bi-directional, low-latency communication. 
- **Backend:** Spring Boot (Java) with WebSocket Message Broker.
- **Frontend:** React (Vite) with `@stomp/stompjs` and `react-youtube`.

---

## 2. Communication Flow & Methods

### Step 1: Connection & Subscription
When a user clicks "Join Room" in the frontend, the following occurs:
1.  **Handshake:** The frontend initiates a WebSocket connection to the backend endpoint defined in `WebSocketConfig.java`:
    *   **Backend Config:** `registry.addEndpoint("/ws")`
    *   **Frontend Action:** Connects to `ws://localhost:8080/ws`.
2.  **Subscribing:** Upon successful connection (`onConnect`), the frontend subscribes to two specific topics:
    *   `/topic/room/${roomId}`: To receive real-time updates of the user roster.
    *   `/topic/room/${roomId}/play`: To receive playback synchronization events (Play/Pause).

### Step 2: Joining a Room
1.  **Publishing:** The frontend sends a JSON payload to the backend:
    *   **Destination:** `/app/room/${roomId}/join`
    *   **Payload:** `{ "username": "...", "roomId": "..." }`
2.  **Backend Processing:**
    *   **Method:** `RoomController.joinRoom(roomId, joinRequest)`
    *   **Logic:** It invokes `JamSessionService.addUserToRoom(roomId, username)`, which stores the user in a `ConcurrentHashMap`.
3.  **Broadcast:** The backend returns the updated set of users. Because of the `@SendTo("/topic/room/{roomId}")` annotation, Spring automatically broadcasts this list to everyone subscribed to that topic.

### Step 3: Playback Synchronization (The "Jam")
When a user interacts with the custom Play/Pause buttons:
1.  **Frontend Action:**
    *   **Method:** `broadcastPlay()` or `broadcastPause()`.
    *   **Logic:** It captures the current time from the YouTube player (`playerRef.current.getCurrentTime()`) and publishes an event.
    *   **Destination:** `/app/room/${roomId}/play`
    *   **Payload:** `{ "action": "PLAY", "timestamp": 12.5 }`
2.  **Backend Processing:**
    *   **Method:** `RoomController.handlePlayBack(roomId, event)`
    *   **Logic:** The server acts as a **mirror**. It receives the event and immediately broadcasts it back to the room via `@SendTo("/topic/room/{roomId}/play")`.
3.  **Client Execution:**
    *   Every client (including the sender) receives the event via their subscription.
    *   **Logic:** The frontend checks the action:
        *   If `PLAY`: Calls `player.seekTo(event.timestamp)` then `player.playVideo()`.
        *   If `PAUSE`: Calls `player.pauseVideo()`.

---

## 3. Key Technical Components

| Component | Responsibility | Key File |
| :--- | :--- | :--- |
| **STOMP Broker** | Manages message routing between `/app` (logic) and `/topic` (broadcast). | `WebSocketConfig.java` |
| **Room Controller** | Routes incoming WebSocket messages to service logic. | `RoomController.java` |
| **Session Service** | Manages the state of active rooms and user lists in memory. | `JamSessionService.java` |
| **YouTube Player** | Synchronized video component with native controls disabled to force sync. | `App.jsx` |
| **STOMP Client** | Maintains the persistent connection and handles event callbacks. | `App.jsx` |

---

## 4. Summary of Interaction
The system ensures "sync" by having the **Server** act as the single source of truth for events. Instead of users controlling their own players directly, their actions are sent to the server, which then "tells" every player in the room (including the one who clicked) what to do simultaneously.
