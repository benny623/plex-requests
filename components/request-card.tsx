import React from "react";
import Image from "next/image";

import { RequestCardProps } from "@/lib/types";
import { statusColor } from "@/lib/helpers";

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
      className="card card-side bg-base-100 shadow-xl w-full hover:scale-105 transition-all duration-200"
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        handleRequestSelect(e, request);
      }}
    >
      {request.request_optional.image && (
        <figure>
          <Image
            src={`https://image.tmdb.org/t/p/w500${request.request_optional.image}`}
            alt="Movie"
            width={75}
            height={115}
            className="object-cover w-full h-full"
          />
        </figure>
      )}
      <div className="card-body">
        <p className="font-bold w-full">{request.request_title}</p>
        <p
          className={`badge badge-outline ${statusColor(request.request_status)}`}
        >
          {request.request_status}
        </p>
      </div>
    </div>
  );
};

export default RequestCard;
