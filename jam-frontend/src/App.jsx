import { useState } from "react";
import Landingpage from "./components/Landingpage";
import SessionPage from "./components/SessionPage";
import "./index.css";

const API_BASE = "http://localhost:8080/api";

function App() {
  const [user, setUser] = useState(null); // { username, isHost }
  const [room, setRoom] = useState(null); // { roomId, hostUsername }

  // Receives final values from Landingpage on submit
  const handleCreateSession = async (username) => {
    try {
      const res = await fetch(`${API_BASE}/rooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostUsername: username }),
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
        setUser({ username, isHost: true });
      }
    } catch (err) {
      console.error("Create session failed:", err);
    }
  };

  const handleJoinSession = async (username, roomCode) => {
    try {
      const res = await fetch(`${API_BASE}/rooms/${roomCode}`);
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
        setUser({ username, isHost: false });
      } else {
        alert("Room not found or wrong code");
      }
    } catch (err) {
      console.error("Join session failed:", err);
    }
  };

  const leaveSession = () => {
    setUser(null);
    setRoom(null);
  };

  return (
    <div className="app-shell">
      {!user || !room ? (
        <Landingpage
          onCreateSubmit={handleCreateSession}
          onJoinSubmit={handleJoinSession}
        />
      ) : (
        <SessionPage room={room} user={user} onLeave={leaveSession} />
      )}
    </div>
  );
}

export default App;
