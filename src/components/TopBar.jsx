import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { CurrentUserContext } from "../contexts/currentUser";

const TopBar = () => {
  const [{ isLoggedIn, currentUser }] = useContext(CurrentUserContext);

  const userImage = "https://static.productionready.io/images/smiley-cyrus.jpg";

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Medium
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
          </li>

          {isLoggedIn !== true ? (
            <>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  Sign in
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link">
                  Sign up
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/articles/new" className="nav-link">
                  <i className="ion-compose" />
                  &nbsp; New Post
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/settings" className="nav-link">
                  <i className="ion-gear-a" />
                  &nbsp; Settings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to={`/profiles/${currentUser.username}`}
                  className="nav-link"
                >
                  <img className="user-pic" src={userImage} alt="user-pic" />
                  &nbsp; {currentUser.username}
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
export default TopBar;
