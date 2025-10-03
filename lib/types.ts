// Request Type
export interface Request {
  request_id: number;
  request_title: string;
  request_year: number;
  request_requestor: string;
  request_type: string;
  request_status: string;
  request_note: string;
  request_optional: Optional;
  request_timestamp: string;
}

// Optional Type
export interface Optional {
  imdbId?: string | number;
  year?: string | number;
  image?: string;
  rated?: string;
  seasons?: Seasons[];
  episode_count?: number;
}

// Seasons Type
export interface Seasons {
  id: string;
  name: string;
  year: string | number;
  episode_count: string | number;
}

// Form Type
export interface FormState {
  title: string;
  email: string;
  type: string;
  optional: Optional;
}

// Search Result Type
export interface SearchResult {
  id: number;
  title: string;
  year: string;
  rated: string | null;
  overview: string;
  poster: string;
  media_type: string;
  rating: string;
  seasons: [];
}

// Home Page Modal Type
export interface ModalType {
  request_id: number;
  request_title: string;
  request_year: number;
  request_requestor: string;
  request_type: string;
  request_status: string;
  request_note: string;
  request_optional: Optional;
  request_timestamp: string;
}

// Request Card Props
export type RequestCardProps = {
  request: Request;
  setModalData?: React.Dispatch<React.SetStateAction<ModalType | null>>;
};

// Request Table Props
export type RequestTableProps = {
  requests: Request[];
  setRequests?: React.Dispatch<React.SetStateAction<Request[]>> | undefined;
  table: boolean;
  setTable: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
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
