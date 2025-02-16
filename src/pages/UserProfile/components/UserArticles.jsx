import React, { useEffect } from "react";
import queryString from "query-string";

import { getPaginator, limit } from "../../../utils";
import useFetch from "../../../hooks/useFetch";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import Feed from "../../../components/Feed";
import Pagination from "../../../components/Pagination/Pagination";

const getApiUrl = ({ username, offset, isFavorites }) => {
  const params = isFavorites
    ? { limit, offset }
    : { limit, offset, author: username };

  const currentUrl = isFavorites ? `/favorites/${username}` : "";

  return `/api/articles${currentUrl}?${queryString.stringify(params)}`;
};

const UserArticles = ({ username, location, url }) => {
  const isFavorites = url.includes("favorites");

  const { offset, currentPage } = getPaginator(location);
  const apiUrl = getApiUrl({ username, offset, isFavorites });
  const [{ response, isLoading, error }, doFetch] = useFetch(apiUrl);

  useEffect(() => {
    doFetch();
  }, [doFetch, isFavorites, currentPage]);

  return (
    <div>
      {isLoading && <Loading />}
      {error && <ErrorMessage />}
      {!isLoading && response && (
        <>
          <Feed articles={response.articles} />
          <Pagination
            total={response.articlesCount}
            limit={limit}
            url={url}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

export default UserArticles;
