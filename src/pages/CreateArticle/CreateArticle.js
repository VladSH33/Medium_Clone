import React, {useState, useEffect, useContext} from 'react'
import ArticleForm from '../../components/ArticleForm';
import useFetch from '../../hooks/useFetch';
import { Navigate } from "react-router-dom";
import {CurrentUserContext} from '../../contexts/currentUser'

const CreateArticle = () => {
  const apiUrl = '/api/articles';
  const [isSuccessfullSubmit, setIsSuccessfullSubmit] = useState(false);
  const [{response, message}, doFetch] = useFetch(apiUrl)
  const [currentUserState] = useContext(CurrentUserContext)

  console.log(response)

  const onSubmit = article => {
    doFetch({
      method: "post",
      data: { article }
    })
  }
  const initialValues = {
    title: '',
    description: '',
    body: '',
    tagList: ''
  }

  useEffect(() => {
    if (!response) {
      return
    }
    setIsSuccessfullSubmit(true)
  }, [response])


  if (isSuccessfullSubmit) {
    return <Navigate to={`/articles/${response.article.slug}`} replace />;
  }

  if (currentUserState.isLoggedIn === null) {
    return null
  }

  if (isSuccessfullSubmit || currentUserState.isLoggedIn === false) {
    return <Navigate to="/" replace/>
  }

  return (
    <div>
      <ArticleForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        errors={message}
      />
    </div>
  )
}

export default CreateArticle
