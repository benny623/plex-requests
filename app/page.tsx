"use client";

import { useState } from "react";
import RequestTable from "@/components/request-table";
//import RequstForm from "@/components/request-form";
import Link from "next/link";

export default function Home() {
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
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/send", {
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
    <div className="h-screen">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:pl-20 lg:text-left">
            <h1 className="text-5xl font-bold">Submit a request! 🎬</h1>
            <p className="py-6">
              Submit a media request by filling out the form!
            </p>
            <Link href="/#requests-table" className="text-info font-bold">See current requests</Link>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Media title"
                  value={formState.title}
                  onChange={handleChange}
                  className="input input-bordered flex items-center"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Year</span>
                </label>
                <input
                  id="year"
                  name="year"
                  type="text"
                  placeholder="Release year"
                  maxLength={4}
                  value={formState.year}
                  onChange={handleChange}
                  className="grow input input-bordered flex items-center gap-2"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Requestor</span>
                </label>
                <input
                  id="requestor"
                  name="requestor"
                  type="text"
                  placeholder="Your name"
                  value={formState.requestor}
                  onChange={handleChange}
                  className="grow input input-bordered flex items-center"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Type</span>
                </label>
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
              <div className="form-control mt-6">
                <button className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <RequstForm onSubmit={handleSubmit} /> */}
      <RequestTable />
    </div>
  );
}
