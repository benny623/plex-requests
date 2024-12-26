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

// Request Table Props
export type RequestTableProps = {
  requests: Request[];
  setRequests?: React.Dispatch<React.SetStateAction<Request[]>> | undefined;
  loading: Status;
  table: boolean;
  setTable: React.Dispatch<React.SetStateAction<boolean>>;
};

// Request Row Props
export type RequestRowProps = {
  request: Request;
  onStatusChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    requestId: number
  ) => Promise<void>;
  onNoteChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    requestId: number
  ) => Promise<void>;
  onNoteBlur: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    requestId: number
  ) => Promise<void>;
  // onDelete: (
  //   e: React.MouseEvent<HTMLButtonElement>,
  //   requestId: number
  // ) => Promise<void>;
  onRequestDelete: (
    e: React.MouseEvent<HTMLButtonElement>,
    requestId: number
  ) => Promise<void>;
};
