"use client";

import { useEffect, useState } from "react";

import { ModalType } from "@/lib/types";
import { statusColor, formatDate } from "@/lib/helpers";

import SearchForm from "@/components/search-form";
import ManualForm from "@/components/manual-form";
import RequestCard from "@/components/request-card";

import useRequestsStore from "@/stores/requestsStore";
import useStatusStore from "@/stores/statusStore";

export default function Home() {
  const {
    currentRequests,
    completedRequests,
    fetchCurrentRequests,
    fetchCompletedRequests,
  } = useRequestsStore();
  const { loading, hasFetched, error, table, setTable } = useStatusStore();
  const [manual, setManual] = useState(false);
  const [modalData, setModalData] = useState<ModalType | null>(null);

  // Fetch data
  useEffect(() => {
    if (table === "current" && !currentRequests.length) {
      fetchCurrentRequests();
    }

    if (table === "completed" && !completedRequests.length) {
      fetchCompletedRequests();
    }
  }, [table, fetchCurrentRequests, fetchCompletedRequests]);

  const renderCurrent = () => {
    return currentRequests.length ? (
      currentRequests.map((request: any) => (
        <RequestCard
          key={request.request_id}
          request={request}
          setModalData={setModalData}
        />
      ))
    ) : (
      <div className="text-2xl font-bold">No current requests</div>
    );
  };

  const renderCompleted = () => {
    return completedRequests.length ? (
      completedRequests.map((request: any) => (
        <RequestCard
          key={request.request_id}
          request={request}
          setModalData={setModalData}
        />
      ))
    ) : (
      <div className="text-2xl font-bold">No recently completed requests</div>
    );
  };

  return (
    <div className="h-screen text-slate-200">
      <div className="hero bg-base-200 min-h-screen px-4">
        <div className="hero-content flex flex-col lg:flex-row-reverse lg:items-center gap-8">
          <div className="text-center lg:pl-20 lg:text-left max-w-xl gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Submit a request! 🎬
            </h1>
            {!manual ? (
              <p className="pt-6 text-base md:text-lg">
                Search for a TV Show, Movie or Anime to request!
                <br />
                If you are unable to find your request via search, click{" "}
                <span
                  className="font-bold text-info hover:text-accent transition-all duration-200"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setManual(!manual);
                  }}
                >
                  here
                </span>{" "}
                to use the Manual Form!
              </p>
            ) : (
              <p className="pt-6 text-base md:text-lg">
                Fill out the form to submit a request!
                <br />
                Click{" "}
                <span
                  className="font-bold text-info hover:text-accent transition-all duration-200"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setManual(!manual);
                  }}
                >
                  here
                </span>{" "}
                to swap back to the Search form.
              </p>
            )}

            <button
              onClick={() => {
                document
                  .querySelector(".requests-table")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn btn-soft btn-info font-bold mt-4"
            >
              <span className="flex items-center gap-2">
                See current requests
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                  />
                </svg>
              </span>
            </button>
          </div>
          <div className="card bg-base-100 w-full sm:w-80 md:w-96 lg:w-[28rem] shrink-0 shadow-2xl">
            {!manual ? (
              <SearchForm refetchRequests={fetchCurrentRequests} />
            ) : (
              <ManualForm refetchRequests={fetchCurrentRequests} />
            )}
          </div>
        </div>
      </div>

      {/* Request Cards */}
      <div className="requests-table min-h-screen flex justify-center items-center bg-base-200 px-4 py-8">
        {loading || !hasFetched ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : error ? (
          <div className="text-2xl font-bold">
            Error Loading Requests: {error}
          </div>
        ) : (
          <div className="flex flex-wrap gap-8 justify-center w-3/4">
            {table === "current" ? renderCurrent() : renderCompleted()}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer footer-center bg-base-300 text-base-content py-4 mt-auto h-[88px]">
        {table === "current" ? (
          <div className="text-center text-xs font-bold text-base-content pt-4">
            Don&apos;t see your request? Check here:{" "}
            <button
              onClick={() => {
                setTable("completed");
                document.querySelector(".requests-table")?.scrollIntoView(true);
              }}
              className="cursor-pointer text-info font-bold hover:text-accent transition-all duration-200"
            >
              Completed Requests
            </button>
          </div>
        ) : (
          <div className="text-center text-xs pt-4">
            <button
              onClick={() => {
                setTable("current");
                document.querySelector(".requests-table")?.scrollIntoView(true);
              }}
              className="cursor-pointer text-info font-bold hover:text-accent transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        )}
      </footer>

      {/* Request Modal */}
      <dialog id="request_modal" className="modal">
        {modalData && (
          <div className="modal-box flex flex-col md:flex-row p-0 sm:w-3/4 md:w-6/12 xl:w-4/12 max-w-4xl transition-all duration-300 ease-in-out">
            {/* Left section (image) */}
            {modalData.request_optional.image && (
              <div className="md:w-1/2 w-full h-64 md:h-auto">
                <img
                  src={`${modalData.request_optional.image}`}
                  alt={`Poster for ${modalData.request_title}`}
                  className="h-full w-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                />
              </div>
            )}

            {/* Right section (content) */}
            <div className="md:w-1/2 w-full p-6">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              {/* Modal Body */}
              <h3 className="font-bold text-2xl">{modalData.request_title}</h3>
              <div className="flex items-center gap-4 sm:gap-8 h-24">
                <div className="flex flex-col justify-center">
                  {modalData.request_optional.year && (
                    <p className="text-lg font-normal">
                      {modalData.request_optional.year}
                    </p>
                  )}
                  <p className="text-sm italic font-normal">
                    {modalData.request_type}
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  {modalData.request_optional.rated && (
                    <p className="badge badge-sm text-slate-400 bg-slate-800">
                      {modalData.request_optional.rated}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400">Status</label>
                  <p
                    className={`badge badge-sm badge-soft py-4 ${statusColor(
                      modalData.request_status
                    )}`}
                  >
                    {modalData.request_status}
                  </p>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-slate-400">Date</label>
                  <p className="text-sm">
                    {formatDate(modalData.request_timestamp)}
                  </p>
                </div>

                {modalData.request_note && (
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-400">Note</label>
                    <p className="text-sm">{modalData.request_note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Modal Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
