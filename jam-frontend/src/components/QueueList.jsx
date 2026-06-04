function QueueList({ queue }) {
  if (!queue?.length) {
    return (
      <div className="panel queue-list">
        <h2 className="heading-sm">Queue</h2>
        <p className="queue-list__empty">
          Nothing queued. Search for songs to add.
        </p>
      </div>
    );
  }

  return (
    <div className="panel queue-list">
      <h2 className="heading-sm">Queue ({queue.length})</h2>
      <div className="queue-list__scroll">
        {queue.map((video, index) => (
          <article
            key={video.queueId || index}
            className={`track-row track-row--queue ${index === 0 ? "track-row--now" : ""}`}
          >
            <img
              className="track-row__thumb"
              src={video.thumbnail}
              alt=""
              loading="lazy"
            />
            <div className="track-row__info">
              <p className="track-row__title">{video.title}</p>
              <p className="track-row__meta">
                {index === 0 ? "Now playing" : `Added by ${video.addedBy || "—"}`}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default QueueList;
