import { useState, useCallback } from "react";
import { FormState, Status } from "@/lib/types";
import { SearchResult } from "@/lib/types";

export const useFormHandlers = (refetchRequests: () => void) => {
  const [ready, setReady] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
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

  // Validate form before submission
  // const validateForm = () => {
  //   let valid = true;
  //   const errors = {
  //     title: "",
  //     email: "",
  //     year: "",
  //   };

  //   // Title Validation
  //   if (!formState.title) {
  //     errors.title = "Title is required";
  //     valid = false;
  //   }

  //   // Email Validation
  //   if (!formState.email) {
  //     errors.email = "Email is required";
  //     valid = false;
  //   } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
  //     errors.email = "Please enter a valid email address";
  //     valid = false;
  //   }

  //   // Year Validation
  //   if (formState.year && !/^\d{4}$/.test(formState.year)) {
  //     errors.year = "Year must be a 4-digit number";
  //     valid = false;
  //   }

  //   setFormErrors(errors);
  //   return valid;
  // };

  // Handle form input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "year") {
      setFormState((prevState) => ({
        ...prevState,
        optional: {
          [name]: value,
        },
      }));

      setStatus((prevState) => ({
        ...prevState,
        success: false,
      }));

      //setReady(false);

      return;
    }

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setStatus((prevState) => ({
      ...prevState,
      success: false,
    }));

    //setReady(false);
  };

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      // Send notification to site admins
      sendNotification();

      setStatus({ loading: true, error: "", success: false });

      setReady(false);
    },
    [formState, refetchRequests]
  );

  // Send notification for updated status
  const sendNotification = async () => {
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
        // Refetch requests data for table
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

          //const notification = await response.json();

          //console.log("Notification sent", notification);
        } catch (err) {
          console.error("Error sending notification", err);
        }

        // TODO: this originally reset the formState, not sure if I still want this or if there's a better solution
        //       the main issue here is that it resets the email field even if "Remember email" is checked
        // setFormState({
        //   title: "",
        //   year: "",
        //   email: "",
        //   type: "Movie",
        //   image: "",
        //   optional: {},
        // });

        setStatus({ loading: false, error: "", success: true });
      } else {
        console.log(`POST Failure: ${result.error || "An error occurred"}`);

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
  };

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = debounce(async (title: string) => {
    if (!title.trim()) return;
    if (searchQuery.loading) return;

    setSearchQuery((prevState) => ({ ...prevState, loading: true }));

    try {
      const response = await fetch(`/api/search/${title}`);
      const data = await response.json();

      setSearchQuery((prevState) => ({
        ...prevState,
        error: "",
        loading: false,
      }));

      setSearchResults(data);
    } catch (err) {
      console.error(err);
      setSearchQuery((prevState) => ({
        ...prevState,
        error: "Failed to search movies",
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
  }, 300);

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
          ...(selected.year && {
            year: parseInt(season.air_date.split("-")[0]),
          }),
          ...(selected.poster && { image: season.poster_path }),
          ...(selected.tvcr && { rating: selected.tvcr }),
        },
      }));
      setReady(true);
      (document.getElementById("search_modal") as HTMLDialogElement).close();
      return;
    }
    // Run standard query if it's a movie or complete series
    setFormState((prevState) => ({
      ...prevState,
      title: selected.title.trim(),
      type: selected.media_type,
      optional: {
        ...(selected.year && { year: parseInt(selected.year) }),
        ...(selected.poster && { image: selected.poster }),
        ...(selected.mpaa && { rating: selected.mpaa }),
        ...(selected.tvcr && { rating: selected.tvcr }),
        ...(selected.seasons && {
          seasons:
            season === "Complete"
              ? selected.seasons.filter(
                  (season: any) => season.name !== "Specials"
                )
              : season,
        }),
      },
    }));
    setReady(true);
    (document.getElementById("search_modal") as HTMLDialogElement).close();
  };

  const handleSearchChange = (e: any) => {
    const { name, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    handleSearch(value);
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
    formState,
    ready,
    status,
    searchQuery,
    searchResults,
    rememberEmail,
    setRememberEmail,
    setFormState,
    handleChange,
    handleSubmit,
    sendNotification,
    handleSearch,
    selectResult,
    handleSearchChange,
    handleCheckboxChange,
    updateStoredEmail,
  };
};
