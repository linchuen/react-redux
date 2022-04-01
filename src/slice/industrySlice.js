import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUrl } from '../api/industryAPI';

const initialState = {
    industry: [],
    status: 'idle',
};

export const fetchTypeAsync = createAsyncThunk(
    'industry/fetchType',
    async () => {
        const data = await fetchUrl('http://localhost:8080/industry/all');
        console.log(data);
        return data;
    }
);

export const industrySlice = createSlice({
    name: 'industry',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTypeAsync.fulfilled, (state, action) => {
                state.industry = action.payload
            })
    },
});

export const { } = industrySlice.actions;

export const selectIndustry = (state) => state.industry;

export default industrySlice.reducer;
