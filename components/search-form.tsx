"use client";

import { useState } from "react";
import Image from "next/image";

export default function SearchForm() {
  const [searchQuery, setSearchQuery] = useState({
    search: "",
    loading: false,
    error: "",
  });

  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setSearchQuery((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSearch = async (e: any) => {
    e.preventDefault();

    if (!searchQuery.search.trim()) return;
    if (searchQuery.loading) return;

    setSearchQuery((prevState) => ({ ...prevState, loading: true }));

    try {
      const response = await fetch(`/api/search/${searchQuery.search}`);
      const data = await response.json();

      console.log(data.results);

      setSearchQuery((prevState) => ({
        ...prevState,
        error: "",
        loading: false,
      }));

      setSearchResults(data.results);
    } catch (err) {
      console.error(err);
      setSearchQuery((prevState) => ({
        ...prevState,
        error: "Failed to search movies",
      }));
    } finally {
      setSearchQuery((prevState) => ({
        ...prevState,
        loading: false,
        error: "",
      }));
      (
        document.getElementById("search_modal") as HTMLDialogElement
      ).showModal();
    }
  };

  const selectResult = (e: any) => {
    const { name, value } = e.target;
    (document.getElementById("search_modal") as HTMLDialogElement).close();
  };

  return (
    <>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <form className="card-body" onSubmit={handleSearch}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search</span>
            </label>
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Movies, TV Shows, Anime"
              value={searchQuery.search}
              onChange={handleChange}
              className="input input-bordered flex items-center"
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary" disabled={searchQuery.loading}>
              {searchQuery.loading ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                "Search"
              )}
            </button>
          </div>
          {searchQuery.error && (
            <div className="form-control mt-4 flex items-center">
              <div className="mt-4 text-red-500">
                <p>Error: {searchQuery.error}</p>
              </div>
            </div>
          )}
        </form>
      </div>
      <dialog id="search_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl relative">
          {/* Modal Header */}
          <div className="sticky top-0 bg-base-100 z-50 flex items-center justify-between px-4 py-2 shadow rounded-lg">
            <h3 className="text-lg font-bold">Search Results</h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>

          {/* Scrollable Content */}
          <div className="h-4/6 overflow-y-auto space-y-4 pt-5">
            {!searchResults.length ? (
              <div className="text-center">No results found</div>
            ) : (
              searchResults.map((result: any) => (
                <div
                  key={result.id}
                  className="card card-side bg-base-300 shadow-xl h-96"
                >
                  <figure className="w-1/3">
                    {result.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                        width={500}
                        height={750}
                        alt={result.title || result.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                        <span>No Image</span>
                      </div>
                    )}
                  </figure>
                  <div className="card-body overflow-hidden w-2/3">
                    <h2 className="card-title line-clamp-1">
                      {result.title || result.name}
                    </h2>
                    <p className="text-sm font-normal italic">
                      {result.release_date || result.first_air_date}
                    </p>
                    <p className="line-clamp-4">{result.overview}</p>
                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-primary"
                        onClick={selectResult}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
