import GlobalFeed from "../pages/GlobalFeed/GlobalFeed";
import Article from "../pages/Article/Article";
import Authentication from "../pages/Authentication/Authentication";
import TagFeed from "../pages/TagFeed/TagFeed";
import YourFeed from "../pages/YourFeed/YourFeed";
import CreateArticle from "../pages/CreateArticle/CreateArticle";
import EditArticle from "../pages/EditArticle/EditArticle";
import Settings from "../pages/SettingsUser/Settings";
import UserProfile from "../pages/UserProfile/UserProfile";

export const privateRoutes = [
  { path: "/", component: GlobalFeed },
  { path: "/profiles/:slug", component: UserProfile },
  { path: "/profiles/:slug/favorites", component: UserProfile },
  { path: "/feed", component: YourFeed },
  { path: "/tags/:tag", component: TagFeed },
  { path: "/articles/:article", component: Article },
  { path: "/articles/:article/edit", component: EditArticle },
  { path: "/articles/new", component: CreateArticle },
  { path: "/login", component: Authentication },
  { path: "/register", component: Authentication },
  { path: "/settings", component: Settings },
];
