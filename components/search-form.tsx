"use client";

import { useEffect } from "react";
import { useFormHandlers } from "@/lib/hooks/useFormHandlers";
import Image from "next/image";

export default function SearchForm({
  refetchRequests,
}: {
  refetchRequests: () => void;
}) {
  const {
    formState,
    ready,
    status,
    searchQuery,
    searchResults,
    rememberEmail,
    setRememberEmail,
    setFormState,
    handleChange,
    handleSubmit,
    handleSearch,
    selectResult,
    handleSearchChange,
    handleCheckboxChange,
    updateStoredEmail,
  } = useFormHandlers(refetchRequests);

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
      {/* Search Card */}
      <div
        className="card bg-base-100   shrink-0 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="card-body">
          <fieldset className="fieldset">
            <label className="fieldset-label">Search</label>
            <div className="join">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Media Title"
                value={formState.title}
                onChange={handleChange}
                className="input input-bordered join-item"
                required
              />
              <button
                className="btn btn-primary join-item w-[86px]"
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
            <label className="fieldset-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your email"
              value={formState.email}
              onChange={handleChange}
              onBlur={updateStoredEmail}
              className="input input-bordered flex items-center w-full"
              required
            />
            <div className="text-center">
              {formState.email && (
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
              )}
            </div>
            {!ready && (
              <div className="text-center my-4 text-success">
                Media data attached, ready to submit!
              </div>
            )}
            <button className="btn btn-neutral" disabled={!ready}>
              {status.loading ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                "Submit"
              )}
            </button>
          </fieldset>
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
      </div>

      {/* Search Modal */}
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
              className="input grow"
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
                          <p className="sm:badge sm:badge-outline">
                            {result.mpaa}
                          </p>
                        )}
                        {result.tvcr && (
                          <p className="sm:badge sm:badge-outline">
                            {result.tvcr}
                          </p>
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
