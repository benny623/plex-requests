// Request Type
export interface Request {
  request_id: number;
  request_title: string;
  request_year: number;
  request_requestor: string;
  request_type: string;
  request_status: string;
  request_note: string;
  request_optional: Optional | null;
}

// Optional Type
export interface Optional {
  year?: string | number;
  poster?: string;
  rating?: string;
  original_name?: string;
  // season_count?: number;
  // season_data?: Seasons;
}

// Seasons Type
export interface Seasons {
  year: string | number;
  episodes: string | number;
}

export interface FormState {
  title: string;
  email: string;
  type: string;
  optional: Optional;
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
  poster: string;
  mpaa: string | null;
  tvcr: string | null;
  seasons: [];
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
  onRequestDelete: (
    e: React.MouseEvent<HTMLButtonElement>,
    requestId: number
  ) => Promise<void>;
};
