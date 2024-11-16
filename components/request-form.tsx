"use client";

import { useState } from "react";

export default function RequestForm() {
  const [formState, setFormState] = useState({
    title: "",
    year: "",
    requestor: "",
    status: "New",
    type: "Movie",
  });

  const handleChange = (e: any) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="w-full max-w-lg form-control">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="input input-bordered flex items-center">
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Title"
              value={formState.title}
              onChange={handleChange}
              className="input input-bordered flex items-center grow"
            />
          </label>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="input input-bordered flex items-center gap-2">
            <input
              id="year"
              name="year"
              type="text"
              placeholder="Year"
              maxLength={4}
              value={formState.year}
              onChange={handleChange}
              className="grow"
            />
          </label>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="input input-bordered flex items-center">
            <input
              id="requestor"
              name="requestor"
              type="text"
              placeholder="Requestor"
              value={formState.requestor}
              onChange={handleChange}
              className="grow"
            />
          </label>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <select
            id="type"
            name="type"
            value={formState.type}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
            <option value="Anime">Anime</option>
          </select>
        </div>
      </div>
      <div className="md:flex md:items-center">
        <div className="md:w-1/3"></div>
        <div className="md:w-2/3">
          <button className="btn" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
