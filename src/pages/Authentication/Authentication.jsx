import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CurrentUserContext } from "../../contexts/currentUser";
import useFetch from "../../hooks/useFetch";
import useLocalStorage from "../../hooks/useLocalStorage";

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Имя пользователя должно содержать минимум 3 символа")
    .required("Имя пользователя обязательно"),
  email: yup.string().email("Некорректный email").required("Email обязателен"),
  password: yup
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .required("Пароль обязателен"),
});

const Authentication = () => {
  const location = useLocation().pathname;
  const isLogin = location === "/login";

  const pageTitle = isLogin ? "Sign In" : "Sign Up";
  const descriptionLink = isLogin ? "/register" : "/login";
  const descriptionText = isLogin ? "Need an account?" : "Have an account?";

  const apiUrl = isLogin ? "/api/login" : "/api/register";

  const [{ isLoading, response, message }, doFetch] = useFetch(apiUrl);
  const [isSuccessfullSubmit, setIsSuccessfullSubmit] = useState(false);
  const [, setToken] = useLocalStorage("token");
  const [, dispatch] = useContext(CurrentUserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const userData = {
      email: data.email,
      password: data.password,
      bio: "default",
      image: "https://randomuser.me/api/portraits/lego/1.jpg",
    };

    if (!isLogin) {
      userData.username = data.username;
    }

    doFetch({
      method: "post",
      data: { user: userData },
    });
  };

  useEffect(() => {
    if (!response) {
      return;
    }
    setToken(response.user.token);
    setIsSuccessfullSubmit(true);
    dispatch({ type: "SET_AUTHORIZED", payload: response.user });
  }, [response, dispatch, setToken]);

  if (isSuccessfullSubmit) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">{pageTitle}</h1>
            <p className="text-xs-center">
              <Link to={descriptionLink}>{descriptionText}</Link>
            </p>
            {message && <div className="error-messages">{message}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
              {!isLogin && (
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Username"
                    {...register("username")}
                  />
                  <p className="error-messages">{errors.username?.message}</p>
                </div>
              )}

              <div className="form-group">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Email"
                  {...register("email")}
                />
                <p className="error-messages">{errors.email?.message}</p>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Password"
                  {...register("password")}
                />
                <p className="error-messages">{errors.password?.message}</p>
              </div>

              <button
                disabled={isLoading}
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
              >
                {pageTitle}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
