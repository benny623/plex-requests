"use client";

import { useState } from "react";

export default function RequestForm() {
  const [formState, setFormState] = useState({
    title: "",
    year: "",
    requestor: "",
    status: "new",
    type: "Movie",
  });

  const handleChange = (e: any) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const result = await res.json();

      if (res.ok) {
        console.log("POST Success");
        setFormState({
          ...formState,
          title: "",
          year: "",
          type: "Movie",
        });
      } else {
        console.log(`POST Failure: ${result.error || "An error occured"}`);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="title"
        name="title"
        type="text"
        placeholder="Title"
        value={formState.title}
        onChange={handleChange}
      />
      <input
        id="year"
        name="year"
        type="number"
        placeholder="Year"
        value={formState.year}
        onChange={handleChange}
      />
      <input
        id="requestor"
        name="requestor"
        type="text"
        placeholder="Requestor"
        value={formState.requestor}
        onChange={handleChange}
      />
      <select
        id="type"
        name="type"
        value={formState.type}
        onChange={handleChange}
      >
        <option value="Movie">Movie</option>
        <option value="TV Show">TV Show</option>
        <option value="Anime">Anime</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
