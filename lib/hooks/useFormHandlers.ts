import { useState,  useCallback } from "react";

export const useFormHandlers = (refetchRequests: () => void) => {
  const [formState, setFormState] = useState({
    title: "",
    year: "",
    email: "",
    status: "New",
    type: "Movie",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    year: "",
    email: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: false,
  });

  // Validate form before submission
  const validateForm = () => {
    let valid = true;
    const errors = {
      title: "",
      email: "",
      year: "",
    };

    // Title Validation
    if (!formState.title) {
      errors.title = "Title is required";
      valid = false;
    }

    // Email Validation
    if (!formState.email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Please enter a valid email address";
      valid = false;
    }

    // Year Validation
    if (formState.year && !/^\d{4}$/.test(formState.year)) {
      errors.year = "Year must be a 4-digit number";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  // Handle form input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear any existing errors for the field
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Fetch requests data
  // const fetchData = async () => {
  //   setStatus({ loading: true, error: "", success: false });
  //   try {
  //     const result = await fetchCurrentRequests();
  //     setRequests(result);
  //     console.log(requests);
  //   } catch (err: unknown) {
  //     setStatus({
  //       loading: false,
  //       error: (err as Error).message,
  //       success: false,
  //     });
  //   } finally {
  //     setStatus((prev) => ({ ...prev, loading: false, success: true }));
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      // Validate the form before submission
      if (!validateForm()) {
        return;
      }

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
          console.log("POST Success");

          // Refetch requests data for table
          refetchRequests();
          
          // Send notification for updated status
          try {
            const response = await fetch("/api/new-notification", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: formState.title,
                year: formState.year,
                type: formState.type,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to send notification");
            }

            const notification = await response.json();

            console.log("Notification sent", notification);
          } catch (err) {
            console.error("Error sending notification", err);
          }

          setFormState({
            title: "",
            year: "",
            email: "",
            status: "New",
            type: "Movie",
          });

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
    },
    [formState, refetchRequests]
  );

  return {
    formState,
    formErrors,
    status,
    handleChange,
    handleSubmit,
  };
};
