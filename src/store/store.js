import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../slice/counterSlice';
import industryReducer from '../slice/industrySlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    industry: industryReducer
  },
});
