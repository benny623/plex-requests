"use client";

import { useState } from "react";
//import { search } from "@/pages/api/search";

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

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

    //   setSearchQuery((prevState) => ({
    //     ...prevState,
    //     results: response,
    //     error: "",
    //     loading: false,
    //   }));
      console.log(response)
    } catch (err) {
      console.error(err);
      setSearchQuery((prevState) => ({
        ...prevState,
        error: "Failed to search movies",
      }));
    } finally {
      setSearchQuery((prevState) => ({ ...prevState, loading: false }));
    }

    setSearchQuery((prevState) => ({
      ...prevState,
      search: "",
      loading: false,
      error: "",
    }));
  };

  return (
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
            placeholder="Search"
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
              "Submit"
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
  );
}
