"use client";

import { useState } from "react";

export default function SearchForm() {
  const [searchQuery, setSearchQuery] = useState({
    search: "",
    results: [],
    loading: false,
    error: "",
  });

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

      setSearchQuery((prevState) => ({
        ...prevState,
        results: data.results.results,
        error: "",
        loading: false,
      }));

      //console.log(searchQuery.results);
    } catch (err) {
      console.error(err);
      setSearchQuery((prevState) => ({
        ...prevState,
        error: "Failed to search movies",
      }));
    } finally {
      setSearchQuery((prevState) => ({ ...prevState, loading: false }));
      (
        document.getElementById("search_modal") as HTMLDialogElement
      ).showModal();
    }

    setSearchQuery((prevState) => ({
      ...prevState,
      search: "",
      loading: false,
      error: "",
    }));
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
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
