import React, { useState, useEffect, useContext } from "react";
import { Navigate, useParams } from "react-router";
import ArticleForm from "../../components/ArticleForm";
import useFetch from "../../hooks/useFetch";
import { CurrentUserContext } from "../../contexts/currentUser";

const EditArticle = () => {
  const { article } = useParams();
  const apiUrl = `/api/articles/${article}`;
  const [isSuccessfullSubmit, setIsSuccessfullSubmit] = useState(false);
  const [
    { response: updateArticleResponse, message: updateArticleError },
    doUpdateArticle,
  ] = useFetch(apiUrl);
  const [{ response: fetchArticleResponse }, doFetchArticle] = useFetch(apiUrl);
  const [currentUserState] = useContext(CurrentUserContext);
  const [initialValues, setInitialValues] = useState(null);

  const onSubmit = (article) => {
    doUpdateArticle({
      method: "put",
      data: {
        article,
      },
    });
  };

  useEffect(() => {
    doFetchArticle();
  }, [doFetchArticle]);

  useEffect(() => {
    if (!fetchArticleResponse) {
      return;
    }

    setInitialValues({
      title: fetchArticleResponse.article.title,
      description: fetchArticleResponse.article.description,
      body: fetchArticleResponse.article.body,
      tagList: fetchArticleResponse.article.tagList.join(" "),
    });
  }, [fetchArticleResponse]);

  useEffect(() => {
    if (!updateArticleResponse) {
      return;
    }

    setIsSuccessfullSubmit(true);
  }, [updateArticleResponse]);

  if (currentUserState.isLoggedIn === null) {
    return null;
  }

  if (currentUserState.isLoggedIn === false) {
    return <Navigate to="/" replace />;
  }

  if (isSuccessfullSubmit) {
    return <Navigate to={`/articles/${article}`} />;
  }

  return (
    <div>
      <ArticleForm
        onSubmit={onSubmit}
        errors={updateArticleError || {}}
        initialValues={initialValues}
      />
    </div>
  );
};

export default EditArticle;
