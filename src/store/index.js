import logger from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const { default: rootReducer } = require("./reducers");

const store = createStore(
    rootReducer,
  composeWithDevTools(applyMiddleware(logger))
);

export default store;
