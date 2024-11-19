"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchCurrentRequests } from "@/lib/fetchRequests";
import RequestTable from "@/components/current-requests";
import Link from "next/link";

export default function Home() {
  const [requests, setRequests] = useState([]);
  const [formState, setFormState] = useState({
    title: "",
    year: "",
    requestor: "",
    status: "New",
    type: "Movie",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    requestor: "",
    year: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: false,
  });

  const validateForm = () => {
    let valid = true;
    const errors = {
      title: "",
      requestor: "",
      year: "",
    };

    // Title Validation
    if (!formState.title) {
      errors.title = "Title is required";
      valid = false;
    }

    // Requestor Validation
    if (!formState.requestor) {
      errors.requestor = "Requestor is required";
      valid = false;
    }

    // Year Validation
    if (formState.year && !/^\d{4}$/.test(formState.year)) {
      errors.year = "Year must be a 4-digit number";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleChange = (e: any) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
    // Clear any existing errors for the field
    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      // Validate the form before submission
      if (!validateForm()) {
        return;
      }

      setStatus({ loading: true, error: "", success: false });

      try {
        const res = await fetch("/api/send-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        });

        const result = await res.json();

        if (res.ok) {
          console.log("POST Success");
          // Send notification for updated status
          try {
            const response = await fetch("/api/new-notification", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: formState.requestor, // TODO: change this to the user's name
                title: formState.title,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to send notification");
            }

            const notification = await response.json();

            console.log("Notification sent", notification);
          } catch (err) {
            console.error("Error sending notification", err);
          }
          setFormState({
            title: "",
            year: "",
            requestor: "",
            status: "New",
            type: "Movie",
          });

          // Refetch requests data for table
          fetchData();
          setStatus({ loading: false, error: "", success: true });
        } else {
          console.log(`POST Failure: ${result.error || "An error occurred"}`);
          setStatus({
            loading: false,
            error: result.error || "An error occurred",
            success: false,
          });
        }
      } catch (err) {
        console.error("Error:", err);
        setStatus({
          loading: false,
          error: "An unexpected error occurred",
          success: false,
        });
      }
    },
    [formState]
  );

  const fetchData = async () => {
    setStatus({ loading: true, error: "", success: false });
    try {
      const result = await fetchCurrentRequests();
      setRequests(result);
    } catch (err: unknown) {
      setStatus({
        loading: false,
        error: (err as Error).message,
        success: false,
      });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  // Initial GET request
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:pl-20 lg:text-left">
            <h1 className="text-5xl font-bold">Submit a request! 🎬</h1>
            <p className="py-6">
              Submit a media request by filling out the form!
            </p>
            <Link href="/#requests-table" className="text-info font-bold">
              See current requests
            </Link>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title *</span>
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
                {formErrors.title && (
                  <p className="text-sm text-red-500">{formErrors.title}</p>
                )}
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
                {formErrors.year && (
                  <p className="text-sm text-red-500">{formErrors.year}</p>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Requestor *</span>
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
                {formErrors.requestor && (
                  <p className="text-sm text-red-500">{formErrors.requestor}</p>
                )}
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
                  <option value="Movie">Movie</option>
                  <option value="TV Show">TV Show</option>
                  <option value="Anime">Anime</option>
                </select>
              </div>
              <div className="form-control mt-4 flex items-center">
                <p className="label-text text-warning">* Required</p>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" disabled={status.loading}>
                  {status.loading ? "Submitting..." : "Submit"}
                </button>
              </div>
              {status.error && (
                <div className="mt-4 text-red-500">
                  <p>Error: {status.error}</p>
                </div>
              )}
              {status.success && (
                <div className="mt-4 text-green-500">
                  <p>Request submitted successfully!</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <RequestTable currentRequests={requests} />
    </div>
  );
}
