import { useRef, useState, useEffect } from "react";
import YouTube from "react-youtube";

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const MediaPlayer = ({
  currentVideo,
  username,
  playbackEvent,
  onPlayPause,
  onSeek,
  onNext,
}) => {
  const playerRef = useRef(null);
  const endedForVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekPreview, setSeekPreview] = useState(null);

  const displayTime = seekPreview ?? currentTime;

  useEffect(() => {
    if (!playbackEvent || !playerRef.current) return;
    if (playbackEvent.username && playbackEvent.username === username) {
      return;
    }

    const player = playerRef.current;

    if (playbackEvent.action === "play") {
      player.playVideo();
      setIsPlaying(true);
      if (playbackEvent.timestamp != null) {
        setCurrentTime(playbackEvent.timestamp);
      }
    } else if (playbackEvent.action === "pause") {
      player.pauseVideo();
      setIsPlaying(false);
      if (playbackEvent.timestamp != null) {
        setCurrentTime(playbackEvent.timestamp);
      }
    } else if (playbackEvent.action === "seek") {
      player.seekTo(playbackEvent.timestamp, true);
      setCurrentTime(playbackEvent.timestamp);
      setSeekPreview(null);
    }
  }, [playbackEvent, username]);

  useEffect(() => {
    endedForVideoRef.current = null;
    setIsPlaying(false);
    setCurrentTime(0);
    setSeekPreview(null);
    setDuration(0);
  }, [currentVideo?.videoId]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(async () => {
        if (playerRef.current && seekPreview === null) {
          const time = await playerRef.current.getCurrentTime();
          setCurrentTime(time);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, seekPreview]);

  const handleReady = async (event) => {
    playerRef.current = event.target;
    const dur = await event.target.getDuration();
    setDuration(dur);
  };

  const handleVideoEnd = () => {
    if (!currentVideo?.videoId) return;
    if (endedForVideoRef.current === currentVideo.videoId) return;
    endedForVideoRef.current = currentVideo.videoId;
    onNext();
  };

  const togglePlayPause = async () => {
    if (!playerRef.current) return;
    const player = playerRef.current;
    const time = await player.getCurrentTime();

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
      onPlayPause("pause", time);
    } else {
      player.playVideo();
      setIsPlaying(true);
      onPlayPause("play", time);
    }
  };

  const handleSeekInput = (e) => {
    setSeekPreview(parseFloat(e.target.value));
  };

  const commitSeek = () => {
    if (seekPreview === null || !playerRef.current) return;
    playerRef.current.seekTo(seekPreview, true);
    setCurrentTime(seekPreview);
    onSeek(seekPreview);
    setSeekPreview(null);
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      playsinline: 1,
      modestbranding: 1,
    },
  };

  if (!currentVideo) {
    return (
      <div className="panel media-player media-player--empty">
        <p className="text-muted">Add a song from Search to start listening.</p>
      </div>
    );
  }

  return (
    <div className="panel media-player">
      <div className="media-player__video">
        <YouTube
          key={currentVideo.videoId}
          videoId={currentVideo.videoId}
          opts={opts}
          onReady={handleReady}
          onEnd={handleVideoEnd}
          className="media-player__youtube"
        />
      </div>

      <div className="media-player__controls">
        <button
          type="button"
          className="btn media-player__btn"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          className="btn media-player__btn"
          onClick={onNext}
        >
          Next
        </button>
        <input
          type="range"
          className="media-player__seek"
          min="0"
          max={duration || 100}
          value={displayTime}
          onChange={handleSeekInput}
          onMouseUp={commitSeek}
          onTouchEnd={commitSeek}
          aria-label="Seek"
        />
        <div className="media-player__time">
          <span>{formatTime(displayTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
