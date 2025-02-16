import React, { useEffect } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";

import useFetch from "../../hooks/useFetch";
import UserArticles from "./components/UserArticles";

const UserProfile = () => {
  const slug = useParams().slug;

  const apiUrl = `/api/profiles/${slug}`;
  const [{ response }, doFetch] = useFetch(apiUrl);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  const currentUrl = useLocation().pathname;
  const searchUrl = useLocation().search;

  if (!response) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img className="user-img" alt="" src={response.profile.image} />
              <h4>{response.profile.username}</h4>
              <p>{response.profile.bio}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <NavLink
                    to={`/profiles/${response.profile.username}`}
                    className="nav-link"
                    end
                  >
                    My Posts
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={`/profiles/${response.profile.username}/favorites`}
                    className="nav-link"
                  >
                    Favorites Posts
                  </NavLink>
                </li>
              </ul>
            </div>
            <UserArticles
              username={response.profile.username}
              location={searchUrl}
              url={currentUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
