import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUrl } from '../api/industryAPI';

export const fetchLeaderboardListAsync = createAsyncThunk(
    'leaderboard/fetchLeaderboardListAsync',
    async (param) => {
        let year = param.year
        let month = param.month
        let data = await fetchUrl('http://127.0.0.1:8080/evaluate/topRank/'+ year+'/' + month)
        console.log(data)
        return { data: data }
    }
);

const initialState = {
    ma5Top100Rank:{},
    ma10Top100Rank:{},
    ma21Top100Rank:{},
    ma62Top100Rank:{},
};

export const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaderboardListAsync.fulfilled, (state, action) => {
                let data = action.payload.data
                state.ma5Top100Rank=data[0]
                state.ma10Top100Rank=data[1]
                state.ma21Top100Rank=data[2]
                state.ma62Top100Rank=data[3]
            })
    },
});

export const { } = leaderboardSlice.actions;

export const selectLeaderboard = (state) => state.leaderboard;

export default leaderboardSlice.reducer;
