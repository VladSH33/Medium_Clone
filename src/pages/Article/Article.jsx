import React, { useEffect, useContext } from "react";
import { Link, useParams, Navigate } from "react-router-dom";

import useFetch from "../../hooks/useFetch";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import TagList from "../../components/TagList";

import { CurrentUserContext } from "../../contexts/currentUser";

const Article = () => {
  const { article } = useParams();

  const apiUrl = `/api/articles/${article}`;
  const [
    {
      response: fetchArticleResponse,
      error: fetchArticleError,
      isLoading: fetchArticleIsLoading,
    },
    doFetch,
  ] = useFetch(apiUrl);
  const [{ isSuccess }, doDeleteArticle] = useFetch(apiUrl);
  const [currentUserState] = useContext(CurrentUserContext);

  const isAuthor = () => {
    if (!fetchArticleResponse || !currentUserState.isLoggedIn) {
      return false;
    }

    return (
      fetchArticleResponse.article.author.username ===
      currentUserState.currentUser.username
    );
  };

  const deleteArticle = () => {
    doDeleteArticle({
      method: "delete",
    });
  };

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  if (isSuccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="article-page">
      <div className="banner">
        {!fetchArticleIsLoading && fetchArticleResponse && (
          <div className="container">
            <h1>{fetchArticleResponse.article.title}</h1>
            <div className="article-meta">
              <Link
                to={`/profiles/${fetchArticleResponse.article.author.username}`}
              >
                <img src={fetchArticleResponse.article.author.image} alt="" />
              </Link>
              <div className="info">
                <Link
                  to={`/profiles/${fetchArticleResponse.article.author.username}`}
                >
                  {fetchArticleResponse.article.author.username}
                </Link>
                <span className="date">
                  {fetchArticleResponse.article.createdAt}
                </span>
              </div>
              {isAuthor() && (
                <span>
                  <Link
                    to={`/articles/${fetchArticleResponse.article.slug}/edit`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="ion-edit"></i>
                    Edit Article
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={deleteArticle}
                  >
                    <i className="ion-trash-a"></i>
                    Delete Article
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="container page">
        {fetchArticleIsLoading && <Loading />}
        {fetchArticleError && <ErrorMessage />}
        {!fetchArticleIsLoading && fetchArticleResponse && (
          <div className="row article-content">
            <div>
              <p>{fetchArticleResponse.article.body}</p>
            </div>
            <TagList tags={fetchArticleResponse.article.tagList} />
          </div>
        )}
        <hr />
      </div>
    </div>
  );
};

export default Article;
