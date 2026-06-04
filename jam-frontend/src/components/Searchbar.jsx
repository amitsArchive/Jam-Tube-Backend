import { useState } from "react";

function Searchbar({ onSearch, onClear }) {
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim() === "") {
      onClear();
    } else {
      onSearch(query.trim());
    }
  }

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      onClear();
    }
  }

  return (
    <div className="search-bar">
      <form className="search-bar__form" onSubmit={handleSearch}>
        <input
          type="search"
          className="input"
          placeholder="Search songs…"
          value={query}
          onChange={handleChange}
          aria-label="Search songs"
        />
        <button type="submit" className="btn btn--primary">
          Search
        </button>
      </form>
    </div>
  );
}

export default Searchbar;
