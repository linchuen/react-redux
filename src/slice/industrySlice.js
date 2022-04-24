import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUrl } from '../api/industryAPI';

const initialState = {
    industry: [],
    growth: {},
    panel: {
        title: '金融',
        growth: 0,
        companies: [],
    },
    stock:{}
};

export const fetchStockDetailAsync = createAsyncThunk(
    'stock/fetchStockDetail',
    async (stockcode) => {
        const data = await fetchUrl('http://localhost:8080/stock/' + stockcode);
        console.log(data)
        return data
    }
);

export const fetchTypeAsync = createAsyncThunk(
    'industry/fetchType',
    async () => {
        const data = await fetchUrl('http://localhost:8080/industry/all');
        console.log(data)
        return data
    }
);

export const fetch_Industry_GrowthAsync = createAsyncThunk(
    'industry/fetchIndustryGrowth',
    async (industryType) => {
        const data = await fetchUrl('http://localhost:8080/industry/growth/'+industryType);
        console.log(data)
        return [industryType, data]
    }
);

export const fetch_SubIndustry_GrowthAsync = createAsyncThunk(
    'industry/fetchSubIndustryGrowthAsync',
    async (param) => {
        let [industryType,subIndustry]=param
        const data = await fetchUrl('http://localhost:8080/industry/growth/'+industryType+'/'+subIndustry);
        console.log(data)
        return [subIndustry, data]
    }
);

export const fetch_Industry_CompaniesAsync = createAsyncThunk(
    'industry/fetchIndustryCompaniesAsync',
    async (industryType) => {
        const data = await fetchUrl('http://localhost:8080/industry/stockInfo/'+industryType);
        console.log(data)
        return [industryType, data]
    }
);

export const fetch_SubIndustry_CompaniesAsync = createAsyncThunk(
    'industry/fetchSubIndustryCompaniesAsync',
    async (param) => {
        let [industryType,subIndustry]=param
        const data = await fetchUrl('http://localhost:8080/industry/stockInfo/'+industryType+'/'+subIndustry);
        console.log(data)
        return [subIndustry, data]
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
            .addCase(fetch_Industry_GrowthAsync.fulfilled, (state, action) => {
                console.log(action.payload[0],action.payload[1])
                state.growth[action.payload[0]]= action.payload[1]
            })
            .addCase(fetch_SubIndustry_GrowthAsync.fulfilled, (state, action) => {
                console.log(action.payload[0],action.payload[1])
                state.growth[action.payload[0]]= action.payload[1]
            })
            .addCase(fetch_Industry_CompaniesAsync.fulfilled, (state, action) => {
                state.panel.title=action.payload[0]
                state.panel.growth=state.growth[action.payload[0]]
                state.panel.companies= action.payload[1]
            })
            .addCase(fetch_SubIndustry_CompaniesAsync.fulfilled, (state, action) => {
                state.panel.title=action.payload[0].replace("->","/")
                state.panel.growth=state.growth[action.payload[0]]
                state.panel.companies= action.payload[1]
            })
            .addCase(fetchStockDetailAsync.fulfilled, (state, action) => {
                state.stock = action.payload
            })
    },
});

export const { } = industrySlice.actions;

export const selectIndustry = (state) => state.industry;

export default industrySlice.reducer;
