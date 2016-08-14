import { combineReducers } from "redux";
import { routerStateReducer as router } from "redux-router";

import Video from "./Video";
import Playlist from "./Playlist";
import Auth from "./Auth";
import Notification from "./Notification";
import Search from "./Search";

export default combineReducers({
  router,
  Video,
  Playlist,
  Auth,
  Notification,
  Search,
});
