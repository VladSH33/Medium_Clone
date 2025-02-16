import React, { useEffect } from "react";
import queryString from "query-string";
import Feed from "../../components/Feed";
import useFetch from "../../hooks/useFetch";
import Pagination from "../../components/Pagination/Pagination";
import { getPaginator, limit } from "../../utils";
import { useLocation } from "react-router";
import PopularTags from "../../components/PopularTags";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import FeedToggler from "../../components/FeedToggler";

const GlobalFeed = () => {
  const { offset, currentPage } = getPaginator(useLocation().search);
  const stringifiedParams = queryString.stringify({
    limit,
    offset,
  });
  const currentUrl = useLocation().pathname;
  const apiUrl = `api/articles?${stringifiedParams}`;
  const [{ response, error, isLoading }, doFetch] = useFetch(apiUrl);
  useEffect(() => {
    doFetch({ method: "GET" });
  }, [currentPage, doFetch]);

  return (
    <div className="home-page">
      <div className="banner">
        <h1>Medium Clone</h1>
        <p>A place to share knowledge</p>
      </div>
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedToggler />
            {isLoading && <Loading />}
            {error && <ErrorMessage />}
            {!isLoading && response && (
              <>
                <Feed articles={response.articles} />
                <Pagination
                  total={response.articlesCount}
                  limit={limit}
                  url={currentUrl}
                  currentPage={currentPage}
                />
              </>
            )}
          </div>
          <div className="col-md-3">
            <PopularTags />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalFeed;
