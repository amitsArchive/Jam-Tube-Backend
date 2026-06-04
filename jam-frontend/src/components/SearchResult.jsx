function SearchResult({ results, onAdd }) {
  if (!results?.length) return null;

  return (
    <div className="search-results">
      <p className="search-results__title">Results</p>
      {results.map((video) => (
        <article key={video.videoId} className="track-row">
          <img
            className="track-row__thumb"
            src={video.thumbnail}
            alt=""
            loading="lazy"
          />
          <div className="track-row__info">
            <p className="track-row__title">{video.title}</p>
          </div>
          <button
            type="button"
            className="btn btn--sm btn--primary"
            onClick={() => onAdd(video)}
          >
            Add
          </button>
        </article>
      ))}
    </div>
  );
}

export default SearchResult;
