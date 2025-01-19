"use client";

import { useEffect, useState } from "react";
import { useFormHandlers } from "@/lib/hooks/useFormHandlers";
import { SearchResult } from "@/lib/types";
import Image from "next/image";

export default function SearchForm({
  refetchRequests,
}: {
  refetchRequests: () => void;
}) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [rememberEmail, setRememberEmail] = useState(false);
  const { formState, setFormState, status, handleChange, handleSubmit } =
    useFormHandlers(refetchRequests);
  const [searchQuery, setSearchQuery] = useState({
    loading: false,
    error: "",
  });

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = debounce(async (title: string) => {
    if (!title.trim()) return;
    if (searchQuery.loading) return;

    setSearchQuery((prevState) => ({ ...prevState, loading: true }));

    try {
      const response = await fetch(`/api/search/${title}`);
      const data = await response.json();

      setSearchQuery((prevState) => ({
        ...prevState,
        error: "",
        loading: false,
      }));

      setSearchResults(data);
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
  }, 300);

  const selectResult = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();

    // Get selected media by id
    const selected = searchResults.find((result: any) => result.id === id);
    if (!selected) {
      console.error(`Result with id ${id} not found`);
      return;
    }

    const seasonElement = document.getElementById(
      `season-${id}`
    ) as HTMLSelectElement | null;

    const getSeasonName = (object: any) => {
      if (seasonElement && seasonElement.value !== "Complete") {
        // Find the selected season data
        const seasonData = object?.seasons.find(
          (season: any) => season.id === parseInt(seasonElement.value)
        );

        if (!seasonData) {
          console.error(`Season with id ${seasonElement.value} not found`);
          return;
        }
        return seasonData;
      }
      return "Complete";
    };

    const season = getSeasonName(selected);

    // Run seperate query if a specific season is selected
    if (season !== "Complete") {
      setFormState((prevState) => ({
        ...prevState,
        title: selected.title + " - " + season.name,
        type: selected.media_type,
        optional: {
          ...(selected.year && {
            year: parseInt(season.air_date.split("-")[0]),
          }),
          ...(selected.poster && { image: season.poster_path }),
          ...(selected.tvcr && { rating: selected.tvcr }),
        },
      }));
    } else {
      // Run standard query if it's a movie or complete series
      setFormState((prevState) => ({
        ...prevState,
        title: selected.title.trim(),
        type: selected.media_type,
        optional: {
          ...(selected.year && { year: parseInt(selected.year) }),
          ...(selected.poster && { image: selected.poster }),
          ...(selected.mpaa && { rating: selected.mpaa }),
          ...(selected.tvcr && { rating: selected.tvcr }),
          ...(selected.seasons && {
            seasons:
              season === "Complete"
                ? selected.seasons.filter(
                    (season: any) => season.name !== "Specials"
                  )
                : season,
          }),
        },
      }));
    }

    (document.getElementById("search_modal") as HTMLDialogElement).close();
  };

  const ratingColor = (rating: number) => {
    switch (true) {
      case rating >= 7:
        return "text-success";
      case rating >= 4 && rating != 7:
        return "text-warning";
      default:
        return "text-error";
    }
  };

  const handleSearchChange = (e: any) => {
    const { name, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    handleSearch(value);
  };

  const handleCheckboxChange = (e: any) => {
    const isChecked = e.target.checked;

    setRememberEmail(isChecked);

    if (isChecked) {
      localStorage.setItem("email", formState.email);
    } else {
      localStorage.removeItem("email");
    }
  };

  const updateStoredEmail = () => {
    if (rememberEmail && formState.email) {
      localStorage.setItem("email", formState.email);
    }
  };

  // Check for value from "remember email" checkbox on form
  useEffect(() => {
    const email = localStorage.getItem("email") || "";

    // Check if the email exists in localstorage and set accordingly
    if (email) {
      setRememberEmail(true);
      setFormState((prevState) => ({ ...prevState, email }));
    }
  }, []);

  return (
    <>
      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Search</span>
          </label>
          <div className="join flex sm:flex-row">
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Media Title"
              value={formState.title}
              onChange={handleChange}
              className="input input-bordered join-item flex-grow w-full"
              required
            />
            <button
              className="btn btn-primary join-item w-[83px]"
              onClick={(e) => {
                e.preventDefault();
                handleSearch(formState.title);
              }}
            >
              {searchQuery.loading ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
            value={formState.email}
            onChange={handleChange}
            onBlur={updateStoredEmail}
            className="grow input input-bordered flex items-center"
            required
          />
        </div>
        {formState.email && (
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Remember email</span>
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="checkbox"
                checked={rememberEmail}
                onChange={handleCheckboxChange}
              />
            </label>
          </div>
        )}
        <div className="form-control mt-6">
          <button className="btn btn-primary" disabled={status.loading}>
            {status.loading ? (
              <span className="loading loading-dots loading-xs"></span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
        {status.error && (
          <div className="form-control mt-4 flex items-center">
            <div className="mt-4 text-red-500">
              <p>Error: {status.error}</p>
            </div>
          </div>
        )}
        {status.success && (
          <div className="form-control mt-4 flex items-center">
            <div className="mt-4 text-green-500">
              Request submitted successfully!
            </div>
          </div>
        )}
      </form>
      <dialog id="search_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl relative">
          {/* Modal Header */}
          <div className="sticky top-0 bg-base-100 z-50 flex items-center justify-between px-4 py-2 shadow-lg rounded-lg gap-4">
            <input
              id="search-title"
              name="title"
              type="text"
              placeholder="Search..."
              value={formState.title}
              onChange={handleSearchChange}
              className="input flex-grow"
              required
            />
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>

          {/* Scrollable Content */}
          <div className="h-4/6 overflow-y-auto space-y-4 pt-5">
            {!searchResults.length ? (
              <div className="text-center animate-appear">No results found</div>
            ) : (
              searchResults.map((result: any) => (
                <div
                  key={result.id}
                  className="card card-side bg-base-300 shadow-xl h-96 animate-altappear"
                >
                  <figure className="w-1/3">
                    {result.poster ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${result.poster}`}
                        width={500}
                        height={750}
                        alt={result.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                        <span>No Image</span>
                      </div>
                    )}
                  </figure>
                  <div className="card-body overflow-hidden w-2/3">
                    <h2 className="card-title line-clamp-1">{result.title}</h2>
                    <div className="flex items-center gap-4 h-24">
                      <div
                        className={`radial-progress max-sm:hidden ${ratingColor(
                          result.rating
                        )}`}
                        style={
                          {
                            "--value": result.rating * 10,
                            "--size": "2.7rem",
                          } as React.CSSProperties
                        }
                        role="progressbar"
                      >
                        {result.rating}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-lg font-normal">{result.year}</p>
                        <p className="text-sm italic font-normal text-accent">
                          {result.media_type}
                        </p>
                      </div>
                      <div className="flex flex-col justify-center">
                        {result.mpaa && (
                          <p className="sm:badge sm:badge-outline">{result.mpaa}</p>
                        )}
                        {result.tvcr && (
                          <p className="sm:badge sm:badge-outline">{result.tvcr}</p>
                        )}
                      </div>
                    </div>
                    <p className="max-h-20 overflow-auto">{result.overview}</p>
                    {/* TODO: Keyword lists tend to be large, and only grabbing 5 doesn't provide the most relevant info. Need to find a better solution if tags want to be included*/}
                    {/* {result.keywords && (
                      <div className="card-actions justify-start line-clamp-1 space-x-2">
                        {result.keywords.slice(0, 5).map((tag: any) => (
                          <div key={tag.id} className="badge badge-outline">
                            {String(tag.name).charAt(0).toUpperCase() +
                              String(tag.name).slice(1)}
                          </div>
                        ))}
                      </div>
                    )} */}
                    <div className="card-actions mt-auto  flex flex-wrap justify-end gap-2">
                      {result.seasons && (
                        <select
                          id={`season-${result.id}`}
                          name="season"
                          defaultValue={"Complete"}
                          className="select select-bordered w-full sm:w-auto"
                        >
                          <option value={"Complete"}>Complete</option>
                          {result.seasons?.map((season: any) => (
                            <option key={season.id} value={season.id}>
                              {season.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        className="btn btn-primary w-full sm:w-auto"
                        onClick={(e) => selectResult(e, result.id)}
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
