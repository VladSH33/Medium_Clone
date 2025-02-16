import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import AppRouter from './router/AppRouter';
import TopBar from './components/TopBar'
import { CurrentUserProvider } from './contexts/currentUser';
import CurrentUserChecker from './components/CurrentUserChecker'
import { makeServer } from "./server/mirageServer";

if (process.env.NODE_ENV === "development") {
  makeServer();
}

const App = () => {
  return (
    <div className="App">
        <BrowserRouter>
          <CurrentUserProvider>
            <CurrentUserChecker>
              <TopBar/>
              <AppRouter />
            </CurrentUserChecker>
          </CurrentUserProvider>
        </BrowserRouter>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);