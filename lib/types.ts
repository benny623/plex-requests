// Request Type
export interface Request {
  request_id: number;
  request_title: string;
  request_year: number;
  request_requestor: string;
  request_type: string;
  request_status: string;
  request_note: string;
}

// Loading Status Type
export interface Status {
  loading: boolean;
  error: string;
  success: boolean;
}

// Search Result Type
export interface SearchResult {
  id: number;
  title: string;
  year: string;
  media_type: string;
}

// Request Props
export type currentProps = {
  currentRequests: Request[];
  loading: Status;
};

export type completedProps = {
  completedRequests: Request[];
  loading: Status;
};

export type adminProps = {
  allRequests: Request[];
  loading: Status;
};
