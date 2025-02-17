import { useEffect, useContext } from "react";
import useFetch from "../hooks/useFetch";
import { CurrentUserContext } from "../contexts/currentUser";
import useLocalStorage from "../hooks/useLocalStorage";

const CurrentUserChecker = ({ children }) => {
  const [, dispatch] = useContext(CurrentUserContext);
  const [{ response }, doFetch] = useFetch("/api/user");
  const [token] = useLocalStorage("token");

  useEffect(() => {
    if (!token) {
      dispatch({ type: "SET_UNAUTHORIZED" });
    }

    doFetch({
      method: "POST",
    });
    dispatch({ type: "LOADING" });
  }, [token, doFetch, dispatch]);

  useEffect(() => {
    if (!response) {
      return;
    }

    dispatch({ type: "SET_AUTHORIZED", payload: response.user });
  }, [response, dispatch]);

  return children;
};

export default CurrentUserChecker;
