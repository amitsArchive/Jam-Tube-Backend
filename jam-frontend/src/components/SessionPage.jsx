import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import SearchBar from "./Searchbar";
import SearchResults from "./SearchResult";
import MediaPlayer from "./MediaPlayer";
import QueueList from "./QueueList";
import MembersList from "./MembersList";

const API_BASE = "http://localhost:8080/api";
const WS_URL = "http://localhost:8080/ws";

const TABS = [
  { id: "now", label: "Now playing" },
  { id: "search", label: "Search" },
  { id: "people", label: "People" },
];

const SessionPage = ({ room, user, onLeave }) => {
  const [client, setClient] = useState(null);
  const [mobileTab, setMobileTab] = useState("now");
  const [copied, setCopied] = useState(false);

  const normalizeMembers = (data) =>
    Array.isArray(data) ? data : data ? [...data] : [];

  const [members, setMembers] = useState(normalizeMembers(room.users));
  const [queue, setQueue] = useState(room.queue || []);
  const [searchResults, setSearchResults] = useState([]);
  const [playbackEvent, setPlaybackEvent] = useState(null);

  const currentVideo = queue.length > 0 ? queue[0] : null;

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      stompClient.publish({
        destination: `/app/room/${room.roomId}/join`,
        body: JSON.stringify({ username: user.username }),
      });

      stompClient.subscribe(`/topic/room/${room.roomId}`, (msg) => {
        setMembers(normalizeMembers(JSON.parse(msg.body)));
      });

      stompClient.subscribe(`/topic/room/${room.roomId}/queue`, (msg) => {
        setQueue(JSON.parse(msg.body));
      });

      stompClient.subscribe(`/topic/room/${room.roomId}/play`, (msg) => {
        setPlaybackEvent(JSON.parse(msg.body));
      });

      stompClient.subscribe(`/topic/room/${room.roomId}/status`, (msg) => {
        const data = JSON.parse(msg.body);
        if (data.action === "SESSION_ENDED") {
          alert("The host has ended the session.");
          onLeave();
        }
      });

      stompClient.subscribe(`/topic/room/${room.roomId}/kick`, (msg) => {
        const data = JSON.parse(msg.body);
        if (data.username === user.username) {
          alert("You have been kicked from the session.");
          onLeave();
        }
      });
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [room.roomId, user.username, onLeave]);

  const handleSearch = async (query) => {
    try {
      const res = await fetch(
        `${API_BASE}/search?search=${encodeURIComponent(query)}`,
      );
      if (res.ok) {
        setSearchResults(await res.json());
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleClearSearch = () => setSearchResults([]);

  const handleAddToQueue = (video) => {
    if (client?.connected) {
      client.publish({
        destination: `/app/room/${room.roomId}/queue/add`,
        body: JSON.stringify({ ...video, addedBy: user.username }),
      });
    }
  };

  const handleNextInQueue = () => {
    if (client?.connected) {
      client.publish({
        destination: `/app/room/${room.roomId}/queue/next`,
        body: JSON.stringify({ videoId: currentVideo?.videoId ?? "" }),
      });
    }
  };

  const handlePlaybackAction = (action, timestamp) => {
    if (client?.connected) {
      client.publish({
        destination: `/app/room/${room.roomId}/play`,
        body: JSON.stringify({
          action,
          timestamp,
          videoId: currentVideo?.videoId,
          username: user.username,
        }),
      });
    }
  };

  const handleEndSession = async () => {
    if (!user.isHost) return;
    try {
      await fetch(
        `${API_BASE}/rooms/${room.roomId}/end?hostUsername=${user.username}`,
        { method: "POST" },
      );
      onLeave();
    } catch (err) {
      console.error("Failed to end session", err);
    }
  };

  const handleKickMember = async (targetUsername) => {
    try {
      await fetch(
        `${API_BASE}/rooms/${room.roomId}/remove/${targetUsername}?hostUsername=${user.username}`,
        { method: "POST" },
      );
    } catch (err) {
      console.error("Failed to kick member", err);
    }
  };

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const colClass = (tab) =>
    `session__col ${mobileTab !== tab ? "session__col--hidden" : ""}`;

  return (
    <div className="session">
      <header className="session__header">
        <div className="session__header-main">
          <h1 className="session__title">Jam</h1>
          <div className="session__meta">
            <span>Room</span>
            <code className="session__code">{room.roomId}</code>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={copyRoomCode}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <div className="session__header-actions">
          {user.isHost ? (
            <button
              type="button"
              className="btn btn--sm btn--danger"
              onClick={handleEndSession}
            >
              End
            </button>
          ) : (
            <button type="button" className="btn btn--sm" onClick={onLeave}>
              Leave
            </button>
          )}
        </div>
      </header>

      <nav className="session__tabs" aria-label="Session sections">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`session__tab ${mobileTab === id ? "session__tab--active" : ""}`}
            onClick={() => setMobileTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="session__body">
        <section className={colClass("search")} aria-label="Search">
          <div className="panel">
            <h2 className="heading-sm">Add music</h2>
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
            <SearchResults results={searchResults} onAdd={handleAddToQueue} />
          </div>
        </section>

        <section className={colClass("now")} aria-label="Player">
          <MediaPlayer
            currentVideo={currentVideo}
            username={user.username}
            playbackEvent={playbackEvent}
            onPlayPause={handlePlaybackAction}
            onSeek={(time) => handlePlaybackAction("seek", time)}
            onNext={handleNextInQueue}
          />
          <QueueList queue={queue} />
        </section>

        <section className={colClass("people")} aria-label="Members">
          <MembersList
            members={members}
            hostUsername={room.hostUsername}
            currentUser={user.username}
            onKick={handleKickMember}
          />
        </section>
      </main>
    </div>
  );
};

export default SessionPage;
