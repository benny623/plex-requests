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
    setReady,
    setRememberEmail,
    setFormState,
    handleChange,
    handleSubmit,
    handleSearch,
    selectResult,
    //handleSearchChange, -- This may come back if we fix the search below
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
      setReady((prevState) => ({
        ...prevState,
        email: true,
      }));
    }
  }, []);

  return (
    <>
      {/* Search Card */}
      <form
        className="card bg-base-100 shrink-0 shadow-2xl"
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
                className="input join-item"
                required
              />
              <button
                className="btn btn-soft btn-primary join-item w-[86px]"
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
              placeholder="mail@site.com"
              value={formState.email}
              onChange={handleChange}
              onBlur={updateStoredEmail}
              className="input validator w-full"
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
                    disabled={!ready.email}
                  />
                </label>
              )}
            </div>
            {ready.media && ready.email && (
              <div>
                <div className="flex flex-row gap-10 justify-center items-center text-center">
                  <Image
                    src={`${formState.optional.image}`}
                    width={100}
                    height={150}
                    alt={formState.title}
                    className="rounded-lg"
                  />
                  <ul>
                    <li className="font-bold text-lg">{formState.title}</li>
                    <li className="italic text-sm">{formState.type}</li>
                    {formState.optional.year && (
                      <li className="text-sm">{formState.optional.year}</li>
                    )}
                    {formState.optional.rated && (
                      <li className="badge badge-accent">
                        {formState.optional.rated}
                      </li>
                    )}
                    {formState.optional.episode_count && (
                      <li className="text-sm">
                        Episode Count: {formState.optional.episode_count}
                      </li>
                    )}
                  </ul>
                </div>
                <div className="text-center my-4 text-success">
                  Media data attached, ready to submit!
                </div>
              </div>
            )}
            <button className="btn" disabled={!ready.media || !ready.email}>
              {status.loading ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                "Submit"
              )}
            </button>
            {status.error && (
              <div className="text-center text-red-500">
                <p>Error: {status.error}</p>
              </div>
            )}
            {status.success && (
              <div className="text-center mt-3 text-success">
                Request submitted successfully!
              </div>
            )}
          </fieldset>
        </div>
      </form>

      {/* Search Modal */}
      <dialog id="search_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl relative">
          {/* Modal Header */}
          {/* TODO: Fix errors that appeared due to new API. Commenting out for now */}
          {/* <div className="sticky top-0 bg-base-100 z-50 flex items-center justify-between px-4 py-2 shadow-lg rounded-lg gap-4">
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
          </div> */}

          {/* Add an X button for mobile closing */}
          <div className="sticky top-0 z-50 flex items-center justify-end px-4 py-2">
            <form method="dialog">
              <button className="btn btn-lg btn-circle btn-accent">✕</button>
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
                        src={`${result.poster}`}
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
                      <div className="flex flex-col justify-center gap-2 sm:gap-0">
                        <p className="text-lg font-normal">{result.year}</p>
                        <p className="text-sm italic font-normal">
                          {result.media_type}
                        </p>
                      </div>
                      <div className="flex flex-col justify-center gap-2">
                        {result.rated && (
                          <p className="badge badge-outline">{result.rated}</p>
                        )}
                        <p
                          className={`${ratingColor(
                            result.rating
                          )} font-bold block sm:hidden`}
                        >
                          {result.rating}/10
                        </p>
                      </div>
                    </div>
                    <p className="max-h-20 overflow-auto">{result.overview}</p>
                    {result.genre && (
                      <div className="card-actions justify-start">
                        {result.genre.map((tag: string, index: number) => (
                          <div key={index} className="badge badge-outline">
                            {tag}
                          </div>
                        ))}
                      </div>
                    )}
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
