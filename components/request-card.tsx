import React from "react";
import Image from "next/image";

import { RequestCardProps } from "@/lib/types";
import { statusColor, formatDate } from "@/lib/helpers";

const RequestCard: React.FC<RequestCardProps> = ({ request, setModalData }) => {
  const handleRequestSelect = (
    e: React.MouseEvent<HTMLDivElement>,
    request: any
  ) => {
    e.preventDefault();

    if (setModalData) {
      setModalData(request || null);
      (
        document.getElementById("request_modal") as HTMLDialogElement
      ).showModal();
    }
  };

  return (
    <div
      className="card card-side bg-base-100 w-full md:w-96 shadow-xl hover:scale-105 transition-all duration-200 ease-in-out"
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        handleRequestSelect(e, request);
      }}
    >
      {request.request_optional.image && (
        <figure>
          <Image
            src={`${request.request_optional.image}`}
            alt={`${request.request_title}`}
            width={75}
            height={115}
            className="object-cover w-full h-full"
            draggable="false"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title">{request.request_title}</h2>
        <p>
          <span className="font-bold">Requested On: </span>
          {formatDate(request.request_timestamp)}
        </p>
        <div className="card-actions justify-end">
          <div
            className={`badge badge-soft ${statusColor(
              request.request_status
            )}`}
          >
            {request.request_status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
