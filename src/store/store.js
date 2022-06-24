import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../slice/counterSlice';
import industryReducer from '../slice/industrySlice';
import statisticsReducer from '../slice/statisticsSlice';
import leaderboardReducer from '../slice/leaderboardSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    industry: industryReducer,
    statistics: statisticsReducer,
    leaderboard: leaderboardReducer
  },
});
