import { useFormHandlers } from "@/lib/hooks/useFormHandlers";
import { useFetchData } from "@/lib/hooks/useFetchData";

export default function RequestForm({ refetchRequests }: { refetchRequests: () => void }) {
  const { formState, formErrors, status, handleChange, handleSubmit } =
    useFormHandlers(refetchRequests);

  return (
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
            <span className="label-text">Requestor Email *</span>
          </label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="Your email"
            value={formState.email}
            onChange={handleChange}
            className="grow input input-bordered flex items-center"
          />
          {formErrors.email && (
            <p className="text-sm text-red-500">{formErrors.email}</p>
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
  );
}
