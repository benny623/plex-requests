// Request Type
export interface Request {
  request_id: number;
  request_title: string;
  request_year: number;
  request_requestor: string;
  request_type: string;
  request_status: string;
}

// Request Props
export type currentProps = {
  currentRequests: Request[];
};

export type completedProps = {
  completedRequests: Request[];
};
