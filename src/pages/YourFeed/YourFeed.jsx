import React, { useEffect, Fragment } from "react";
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
import Banner from "../../components/Banner";

const YourFeed = () => {
  const { offset, currentPage } = getPaginator(useLocation().search);
  const stringifiedParams = queryString.stringify({
    limit,
    offset,
  });
  const apiUrl = `api/articles/feed?${stringifiedParams}`;
  const currentUrl = useLocation().pathname;
  const [{ response, error, isLoading }, doFetch] = useFetch(apiUrl);

  useEffect(() => {
    doFetch();
  }, [currentPage, doFetch]);

  return (
    <div className="home-page">
      <Banner />
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedToggler />
            {isLoading && <Loading />}
            {error && <ErrorMessage />}
            {!isLoading && response && (
              <Fragment>
                <Feed articles={response.articles} />
                <Pagination
                  total={response.articlesCount}
                  limit={limit}
                  url={currentUrl}
                  currentPage={currentPage}
                />
              </Fragment>
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

export default YourFeed;
