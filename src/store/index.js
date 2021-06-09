import logger from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = { };

const counterReducer = (state = initialState, action) => {
  return state;
};

const store = createStore(
  counterReducer,
  composeWithDevTools(applyMiddleware(logger))
);



export default store;
