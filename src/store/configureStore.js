import { createLogger } from "redux-logger";

const { createStore, compose, applyMiddleware } = require("redux");
const { default: rootReducer } = require("./reducers");

const loggerMiddleware = createLogger();
const middleware = [];

//for redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(preloadedState){
    return createStore(
      rootReducer,
      preloadedState,
      composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
    );
}