import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUrl } from '../api/commonAPI';

export const fetchStockDetailAsync = createAsyncThunk(
    'leaderboard/fetchStockDetail',
    async (stockcode) => {
        const data = await fetchUrl('http://localhost:8080/stock/' + stockcode)
        console.log(stockcode, data)
        return { stockcode: stockcode, data: data }
    }
);

export const fetchLeaderboardListAsync = createAsyncThunk(
    'leaderboard/fetchLeaderboardListAsync',
    async (param) => {
        let year = param.year
        let month = param.month
        let data = await fetchUrl('http://127.0.0.1:8080/evaluate/topRank/' + year + '/' + month)
        console.log(data)
        return { data: data }
    }
);

const initialState = {
    ma5Top100Rank: {},
    ma10Top100Rank: {},
    ma21Top100Rank: {},
    ma62Top100Rank: {},
    intersectionRank: {},
    industryOption: [],
    avgOption: [],
    isFiliter: false,
    rankStock: {}
};

export const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {
        setIndustryOption: (state, action) => {
            let index = state.industryOption.findIndex(i => i === action.payload)
            if (index === -1) {
                state.industryOption.push(action.payload)
            } else {
                state.industryOption.splice(index, 1)
            }
        },
        setAvgOption: (state, action) => {
            let index = state.avgOption.findIndex(i => i === action.payload)
            if (index === -1) {
                state.avgOption.push(action.payload)
            } else {
                state.avgOption.splice(index, 1)
            }
        },
        setIsFiliter: (state, action) => {
            state.isFiliter = !state.isFiliter
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaderboardListAsync.fulfilled, (state, action) => {
                let data = action.payload.data
                state.ma5Top100Rank = data[0]
                state.ma10Top100Rank = data[1]
                state.ma21Top100Rank = data[2]
                state.ma62Top100Rank = data[3]
                state.intersectionRank = data[4]
            })
            .addCase(fetchStockDetailAsync.fulfilled, (state, action) => {
                let stockcode = action.payload.stockcode
                let data = action.payload.data
                state.rankStock[stockcode] = data
            })
    },
});

export const { setAvgOption, setIndustryOption, setIsFiliter } = leaderboardSlice.actions;

export const selectLeaderboard = (state) => state.leaderboard;

export default leaderboardSlice.reducer;
