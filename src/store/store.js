import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../slice/counterSlice';
import industryReducer from '../slice/industrySlice';
import statisticsReducer from '../slice/statisticsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    industry: industryReducer,
    statistics: statisticsReducer
  },
});
