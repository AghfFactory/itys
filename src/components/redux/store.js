import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // Assuming you have reducers in a separate file

const store = configureStore({
  reducer: rootReducer,
  // Optionally configure middleware, devtools, etc.
});

export default store;
