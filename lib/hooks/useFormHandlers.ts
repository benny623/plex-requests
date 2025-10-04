import { useState, useCallback } from "react";
import { FormState, Status } from "@/lib/types";
import { SearchResult } from "@/lib/types";

export const useFormHandlers = (refetchRequests: () => void) => {
  const [ready, setReady] = useState<{ media: boolean; email: boolean }>({
    media: false,
    email: false,
  });
  const [rememberEmail, setRememberEmail] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [resultPages, setResultPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(2);
  const [formState, setFormState] = useState<FormState>({
    title: "",
    email: "",
    type: "Movie",
    optional: {},
  });

  const [status, setStatus] = useState<Status>({
    loading: false,
    error: "",
    success: false,
  });

  const [searchQuery, setSearchQuery] = useState({
    loading: false,
    error: "",
  });

  // Handle form input changes
  const handleChange = (e: any) => {
    const { name, value, validity } = e.target;

    // If email is valid set email ready state to true
    if (name === "email" && !validity.valid) {
      setReady((prevState) => ({
        ...prevState,
        email: false,
      }));
    }

    if (name === "email" && validity.valid) {
      setReady((prevState) => ({
        ...prevState,
        email: true,
      }));
    }

    // If the title is changed, set title ready state to false
    if (name === "title") {
      setReady((prevState) => ({
        ...prevState,
        media: false,
      }));

      // Reset status
      setStatus({
        loading: false,
        error: "",
        success: false,
      });
    }

    // If year is input on the manual form we need to change the formState
    if (name === "year") {
      return setFormState((prevState) => ({
        ...prevState,
        optional: {
          [name]: value,
        },
      }));
    }

    return setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Send notification for updated status
  

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

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
          refetchRequests();

          try {
            const response = await fetch("/api/new-notification", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: formState.title,
                type: formState.type,
                email: formState.email,
                optional: formState.optional,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to send notification");
            }
          } catch (err) {
            console.error("Error sending notification", err);
          }

          setFormState((prevState) => ({
            ...prevState,
            title: "",
            year: "",
            type: "Movie",
            image: "",
            optional: {},
          }));

          setStatus({ loading: false, error: "", success: true });
          setReady((prev) => ({ ...prev, media: false }));
        } else {
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
    [formState, refetchRequests] // only the real deps
  );

  const handleSearch = async (title: string, page: number, year?: string | number) => {
    if (!title.trim()) return;

    if (searchQuery.loading) return;

    setSearchQuery((prevState) => ({ ...prevState, loading: true }));

    // Resets page count and results upon new search
    setSearchResults([]);
    setCurrentPage(2);

    try {
      const response = await fetch(`/api/search/${title}-${page}${year ? `-${year}` : ""}`);
      const data = await response.json();

      setSearchQuery((prevState) => ({
        ...prevState,
        error: "",
        loading: false,
      }));

      setSearchResults(data.results);
      setResultPages(Math.ceil(data.totalResults / 10));
    } catch (err) {
      console.error(err);
      setSearchQuery((prevState) => ({
        ...prevState,
        error: "Failed to search",
      }));
    } finally {
      setSearchQuery((prevState) => ({
        ...prevState,
        loading: false,
        error: "",
      }));
      (
        document.getElementById("search_modal") as HTMLDialogElement
      ).showModal();
    }
  };

  const handleLoadMore = async (title: string, page: number) => {
    if (!title.trim()) return;

    if (searchQuery.loading) return;

    setSearchQuery((prevState) => ({ ...prevState, loading: true }));

    if (currentPage < resultPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }

    try {
      const response = await fetch(`/api/search/${title}-${page}`);
      const data = await response.json();

      setSearchQuery((prevState) => ({
        ...prevState,
        error: "",
        loading: false,
      }));

      setSearchResults([...searchResults, ...data.results]);
      setResultPages(Math.ceil(data.totalResults / 10));
    } catch (err) {
      console.error(err);
      setSearchQuery((prevState) => ({
        ...prevState,
        error: "Failed to search",
      }));
    } finally {
      setSearchQuery((prevState) => ({
        ...prevState,
        loading: false,
        error: "",
      }));
      (
        document.getElementById("search_modal") as HTMLDialogElement
      ).showModal();
    }
  };

  const selectResult = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();

    // Get selected media by id
    const selected = searchResults.find((result: any) => result.id === id);
    if (!selected) {
      console.error(`Result with id ${id} not found`);
      return;
    }

    const seasonElement = document.getElementById(
      `season-${id}`
    ) as HTMLSelectElement | null;

    const getSeasonName = (object: any) => {
      if (seasonElement && seasonElement.value !== "Complete") {
        // Find the selected season data
        const seasonData = object?.seasons.find(
          (season: any) => season.id === parseInt(seasonElement.value)
        );

        if (!seasonData) {
          console.error(`Season with id ${seasonElement.value} not found`);
          return;
        }
        return seasonData;
      }
      return "Complete";
    };

    const season = getSeasonName(selected);

    // Run seperate query if a specific season is selected
    if (season !== "Complete") {
      setFormState((prevState) => ({
        ...prevState,
        title: selected.title + " - " + season.name,
        type: selected.media_type,
        optional: {
          imdbId: selected.id,
          ...(selected.year && { year: season.year }),
          ...(selected.poster && { image: selected.poster }),
          ...(selected.rated && { rated: selected.rated }),
          ...(season.episode_count && { episode_count: season.episode_count }),
        },
      }));

      (document.getElementById("search_modal") as HTMLDialogElement).close();

      return setReady((prevState) => ({
        ...prevState,
        media: true,
      }));
    }
    // Run standard query if it's a movie or complete series
    setFormState((prevState) => ({
      ...prevState,
      title: selected.title.trim(),
      type: selected.media_type,
      optional: {
        ...(selected.id && { imdbId: selected.id }),
        ...(selected.year && { year: parseInt(selected.year) }),
        ...(selected.poster && { image: selected.poster }),
        ...(selected.rated && { rated: selected.rated }),
        ...(selected.seasons && { seasons: selected.seasons }),
      },
    }));

    (document.getElementById("search_modal") as HTMLDialogElement).close();

    return setReady((prevState) => ({
      ...prevState,
      media: true,
    }));
  };

  const handleCheckboxChange = (e: any) => {
    const isChecked = e.target.checked;
    setRememberEmail(isChecked);

    if (isChecked) {
      localStorage.setItem("email", formState.email);
    } else {
      localStorage.removeItem("email");
    }
  };

  const updateStoredEmail = () => {
    if (rememberEmail && formState.email) {
      localStorage.setItem("email", formState.email);
    }
  };

  return {
    ready,
    formState,
    status,
    searchQuery,
    searchResults,
    resultPages,
    rememberEmail,
    currentPage,
    setReady,
    setRememberEmail,
    setFormState,
    handleChange,
    handleSubmit,
    handleSearch,
    handleLoadMore,
    selectResult,
    handleCheckboxChange,
    updateStoredEmail,
  };
};
