"use client";

import { useEffect } from "react";
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
            className="input input-bordered join-item grow w-full"
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
