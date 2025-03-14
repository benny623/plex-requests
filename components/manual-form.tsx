"use client";

import { useEffect, useState } from "react";
import { useFormHandlers } from "@/lib/hooks/useFormHandlers";

export default function ManualForm({
  refetchRequests,
}: {
  refetchRequests: () => void;
}) {
  const {
    formState,
    setFormState,
    rememberEmail,
    setRememberEmail,
    status,
    handleChange,
    handleSubmit,
    handleCheckboxChange,
    updateStoredEmail,
  } = useFormHandlers(refetchRequests);

  const [ready, setReady] = useState<{ media: boolean; email: boolean }>({
    media: false,
    email: false,
  });

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

  // Check to make sure the title exists before setting media ready state
  useEffect(() => {
    if (formState.title.length > 0) {
      return setReady((prevValue) => ({
        ...prevValue,
        media: true,
      }));
    }

    // Set media ready state to false if title is removed
    return setReady((prevValue) => ({
      ...prevValue,
      media: false,
    }));
  }, [formState]);

  return (
    <>
      {/* Manual card */}
      <form
        className="card bg-base-100 shrink-0 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="card-body" onSubmit={handleSubmit}>
          <fieldset>
            <label className="fieldset-label">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Media Title"
              value={formState.title}
              onChange={handleChange}
              className="input w-full"
              required
            />

            <label className="fieldset-label mt-2">Year</label>
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
              className="input w-full"
            />

            <label className="label mt-2">Type *</label>
            <select
              id="type"
              name="type"
              value={formState.type}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Anime">Anime</option>
              <option value="Anime Movie">Anime Movie</option>
              <option value="Movie">Movie</option>
              <option value="Seasonal Movie">Seasonal Movie</option>
              <option value="TV Show">TV Show</option>
            </select>

            <label className="label mt-2">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your email"
              value={formState.email}
              onChange={handleChange}
              onBlur={updateStoredEmail}
              className="input w-full"
              required
            />

            {formState.email && (
              <div className="text-center mt-2">
                <label className="label cursor-pointer">
                  Remember email
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

            <button
              className="btn btn-primary mt-2 w-full"
              disabled={!ready.media || !ready.email}
            >
              {status.loading ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                "Submit"
              )}
            </button>

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
          </fieldset>
        </div>
      </form>
    </>
  );
}
