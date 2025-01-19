"use client";

import { useEffect, useState } from "react";
import { useFormHandlers } from "@/lib/hooks/useFormHandlers";

export default function ManualForm({
  refetchRequests,
}: {
  refetchRequests: () => void;
}) {
  const [rememberEmail, setRememberEmail] = useState(false);
  const { formState, setFormState, status, handleChange, handleSubmit } =
    useFormHandlers(refetchRequests);
  //     let timeout: NodeJS.Timeout;
  //     return (...args: any[]) => {
  //       clearTimeout(timeout);
  //       timeout = setTimeout(() => func(...args), delay);
  //     };
  //   };

  //   const handleSearch = debounce(async (title: string) => {
  //     if (!title.trim()) return;
  //     if (searchQuery.loading) return;

  //     setSearchQuery((prevState) => ({ ...prevState, loading: true }));

  //     try {
  //       const response = await fetch(`/api/search/${title}`);
  //       const data = await response.json();

  //       setSearchQuery((prevState) => ({
  //         ...prevState,
  //         error: "",
  //         loading: false,
  //       }));

  //       setSearchResults(data);
  //     } catch (err) {
  //       console.error(err);
  //       setSearchQuery((prevState) => ({
  //         ...prevState,
  //         error: "Failed to search movies",
  //       }));
  //     } finally {
  //       setSearchQuery((prevState) => ({
  //         ...prevState,
  //         loading: false,
  //         error: "",
  //       }));
  //       (
  //         document.getElementById("search_modal") as HTMLDialogElement
  //       ).showModal();
  //     }
  //   }, 300);

  //   const selectResult = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
  //     e.preventDefault();

  //     // Get selected media by id
  //     const selected = searchResults.find((result: any) => result.id === id);
  //     if (!selected) {
  //       console.error(`Result with id ${id} not found`);
  //       return;
  //     }

  //     const seasonElement = document.getElementById(
  //       `season-${id}`
  //     ) as HTMLSelectElement | null;

  //     const getSeasonName = (object: any) => {
  //       if (seasonElement && seasonElement.value !== "Complete") {
  //         // Find the selected season data
  //         const seasonData = object?.seasons.find(
  //           (season: any) => season.id === parseInt(seasonElement.value)
  //         );

  //         if (!seasonData) {
  //           console.error(`Season with id ${seasonElement.value} not found`);
  //           return;
  //         }
  //         return seasonData;
  //       }
  //       return "Complete";
  //     };

  //     const season = getSeasonName(selected);

  //     // Run seperate query if a specific season is selected
  //     if (season !== "Complete") {
  //       setFormState((prevState) => ({
  //         ...prevState,
  //         title: selected.title + " - " + season.name,
  //         type: selected.media_type,
  //         optional: {
  //           ...(selected.year && {
  //             year: parseInt(season.air_date.split("-")[0]),
  //           }),
  //           ...(selected.poster && { image: season.poster_path }),
  //           ...(selected.tvcr && { rating: selected.tvcr }),
  //         },
  //       }));
  //     } else {
  //       // Run standard query if it's a movie or complete series
  //       setFormState((prevState) => ({
  //         ...prevState,
  //         title: selected.title.trim(),
  //         type: selected.media_type,
  //         optional: {
  //           ...(selected.year && { year: parseInt(selected.year) }),
  //           ...(selected.poster && { image: selected.poster }),
  //           ...(selected.mpaa && { rating: selected.mpaa }),
  //           ...(selected.tvcr && { rating: selected.tvcr }),
  //           ...(selected.seasons && {
  //             seasons:
  //               season === "Complete"
  //                 ? selected.seasons.filter(
  //                     (season: any) => season.name !== "Specials"
  //                   )
  //                 : season,
  //           }),
  //         },
  //       }));
  //     }

  //     (document.getElementById("search_modal") as HTMLDialogElement).close();
  //   };

  //   const ratingColor = (rating: number) => {
  //     switch (true) {
  //       case rating >= 7:
  //         return "text-success";
  //       case rating >= 4 && rating != 7:
  //         return "text-warning";
  //       default:
  //         return "text-error";
  //     }
  //   };

  //   const handleSearchChange = (e: any) => {
  //     const { name, value } = e.target;

  //     setFormState((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));

  //     handleSearch(value);
  //   };

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
            <span className="label-text">Title *</span>
          </label>
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
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Year</span>
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min="1900"
            max={`${new Date().getFullYear() + 5}`}
            placeholder="Release year"
            maxLength={4}
            value={formState.optional.year || ""}
            onChange={handleChange}
            className="grow input input-bordered flex items-center gap-2"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Type *</span>
          </label>
          <select
            id="type"
            name="type"
            value={formState.type}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="Anime">Anime</option>
            <option value="Anime Movie">Anime Movie</option>
            <option value="Movie">Movie</option>
            <option value="Seasonal Movie">Seasonal Movie</option>
            <option value="TV Show">TV Show</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email *</span>
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
    </>
  );
}
