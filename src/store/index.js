import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
  import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";

const { default: rootReducer } = require("./reducers");

const store = createStore(
    rootReducer,
  composeWithDevTools(applyMiddleware(logger,thunkMiddleware))
);

export default store;
