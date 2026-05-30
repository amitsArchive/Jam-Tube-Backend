import { useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import YouTube from "react-youtube";

function App() {
  const [isInRoom, setIsInRoom] = useState(false);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState("dQw4w9WgXcQ"); // Default video
  const currentVideoIdRef = useRef("dQw4w9WgXcQ");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [queue, setQueue] = useState([])
  const stompClientRef = useRef(null)
  const playerRef = useRef(null) // Holds the YouTube player instance

  const updateCurrentVideoId = (newId) => {
    setCurrentVideoId(newId);
    currentVideoIdRef.current = newId;
  }

  const joinRoom = (e) => {
    e.preventDefault();
    if (!username || !roomId) return;

    // 1. Initialize the STOMP client
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        console.log("Connected to broker!");
        setIsInRoom(true);
        // Subscription 1: User Roster
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          setUsersList(JSON.parse(message.body));
        });

        // Subscription 2: Playback Sync
        client.subscribe(`/topic/room/${roomId}/play`, (message) => {
          const event = JSON.parse(message.body);
          const player = playerRef.current;

          // If a NEW video ID is broadcasted, update it
          if (event.videoId && event.videoId !== currentVideoIdRef.current) {
            updateCurrentVideoId(event.videoId);
          }

          if (player) {
            if (event.action === "PLAY") {
              // Force the player to the correct timestamp to stay synced
              player.seekTo(event.timestamp, true);
              player.playVideo();
            } else if (event.action === "PAUSE") {
              player.pauseVideo();
            }
          }
        });
        // 3. NEW: Queue Sync
        client.subscribe(`/topic/room/${roomId}/queue`, (message) => {
          setQueue(JSON.parse(message.body));
        });

        // 4. Announce our arrival to the server
        client.publish({
          destination: `/app/room/${roomId}/join`,
          body: JSON.stringify({ username: username, roomId: roomId }),
        });
      },
    });

    client.activate();
    stompClientRef.current = client;
  };

  //Shared Remote Control
  const broadcastPlay = (videoId = currentVideoId, timestamp = null) => {
    if (!stompClientRef.current) return;
    
    // If no timestamp is provided, get it from the player
    const targetTimestamp = (timestamp !== null) ? timestamp : (playerRef.current ? playerRef.current.getCurrentTime() : 0);

    stompClientRef.current.publish({
      destination: `/app/room/${roomId}/play`,
      body: JSON.stringify({
        action: "PLAY",
        timestamp: targetTimestamp,
        videoId: videoId,
      }),
    });
  };

  const broadcastPause = () => {
    if (!playerRef.current || !stompClientRef.current) return;

    stompClientRef.current.publish({
      destination: `/app/room/${roomId}/play`,
      body: JSON.stringify({ action: "PAUSE", timestamp: 0 }),
    });
  };

  //Queue Management
  const addToQueue = (video) => {
    if (!stompClientRef.current) return;

    stompClientRef.current.publish({
      destination: `/app/room/${roomId}/queue/add`,
      body: JSON.stringify(video),
    });

    // Clear search results after adding
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleNext = () => {
    if (queue.length > 0 && stompClientRef.current) {
      const nextVideo = queue[0];

      // 1. Tell server to pop the queue
      stompClientRef.current.publish({
        destination: `/app/room/${roomId}/queue/next`,
      });

      // 2. Broadcast a PLAY command for the new video starting at 0
      broadcastPlay(nextVideo.videoId, 0);
    }
  };

  const handleVideoEnd = () => {
    handleNext();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/search?search=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search failed", err);
    }
    setIsSearching(false);
  };

  //set up youtube player options
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      controls: 0,
      disablekb: 1,
    },
  };

  if (!isInRoom) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <h1>Join a Jam Session</h1>
        <form
          onSubmit={joinRoom}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
          <button type="submit">Join Room</button>
        </form>
      </div>
    );
  }

  // --- UI: ROOM VIEW ---
  return (
    <div style={{ padding: "2rem", display: "flex", gap: "2rem" }}>
      <div>
        <h1>Room: {roomId}</h1>

        <div style={{ pointerEvents: "none" }}>
          <YouTube
            videoId={currentVideoId}
            opts={opts}
            onReady={(e) => (playerRef.current = e.target)}
            onEnd={handleVideoEnd}
          />
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <button
            onClick={() => broadcastPlay()}
            style={{ padding: "10px 20px" }}
          >
            ▶️ PLAY
          </button>
          <button onClick={broadcastPause} style={{ padding: "10px 20px" }}>
            ⏸️ PAUSE
          </button>
          <button 
            onClick={handleNext} 
            disabled={queue.length === 0}
            style={{ padding: "10px 20px", cursor: queue.length === 0 ? "not-allowed" : "pointer" }}
          >
            ⏭️ NEXT
          </button>
        </div>

        {/* Queue Interface */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <h3>Add to Queue</h3>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
          >
            <input
              type="text"
              placeholder="Search for a song or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: "8px" }}
            />
            <button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Search Results Dropdown/List */}
          {searchResults.length > 0 && (
            <div
              style={{
                border: "1px solid #eee",
                padding: "10px",
                marginBottom: "15px",
                background: "#f9f9f9",
              }}
            >
              <h4 style={{ marginTop: 0 }}>Results:</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {searchResults.map((result) => (
                  <li
                    key={result.videoId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                      paddingBottom: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <img
                      src={result.thumbnail}
                      alt="thumbnail"
                      width="60"
                      style={{ borderRadius: "4px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        <strong>{result.title}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => addToQueue(result)}
                      style={{ padding: "5px 10px", cursor: "pointer" }}
                    >
                      + Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Queue Display */}
          <h4>Up Next ({queue.length})</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {queue.length === 0 ? (
              <li>Queue is empty</li>
            ) : (
              queue.map((video, idx) => (
                <li 
                  key={idx} 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "10px", 
                    marginBottom: "8px",
                    padding: "8px",
                    background: "#fefefe",
                    border: "1px solid #eee",
                    borderRadius: "4px"
                  }}
                >
                  <img src={video.thumbnail} alt="thumb" width="40" style={{ borderRadius: "2px" }} />
                  <span style={{ fontSize: "14px" }}>{video.title}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div
        style={{
          minWidth: "200px",
          padding: "10px",
          border: "1px solid #ccc",
          height: "fit-content",
        }}
      >
        <h3>Users ({usersList.length}):</h3>
        <ul>
          {usersList.map((user, idx) => (
            <li key={idx}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
