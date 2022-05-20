import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUrl } from '../api/industryAPI';

export const fetchStockDetailStatisticsListAsync = createAsyncThunk(
    'statistics/fetchStockDetailStatisticsListAsync',
    async (stockcode) => {
        let data = await fetchUrl('http://127.0.0.1:8080/statistics/' + stockcode + '/'+30)
        console.log(data)
        return { stockcode: stockcode, data: data }
    }
);

export const fetch_All_Industry_TypeAsync = createAsyncThunk(
    'statistics/fetchAllIndustryTypeAsync',
    async () => {
        const data = await fetchUrl('http://localhost:8080/industry/type')
        console.log(data)
        let json = { data: data }
        return json
    }
);


export const fetch_Industry_CompaniesAsync = createAsyncThunk(
    'statistics/fetchIndustryCompaniesAsync',
    async (industryType) => {
        const data = await fetchUrl('http://localhost:8080/industry/stockInfo/' + industryType)
        console.log(industryType, data)
        let json = { industryType: industryType, data: data }
        return json
    }
);

const initialState = {
    allIndustryType: [],
    industryCompanies: {},
    title: '2330 台積電',
    companies: {},
    avg5d:false,
    avg10d:true,
    avg21d:false,
    avg62d:true,
    data: []
};

export const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        setTitle: (state, action) => {
            let stockcode = action.payload
            state.title = stockcode + ' ' + state.companies[stockcode]
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStockDetailStatisticsListAsync.fulfilled, (state, action) => {
                let data = action.payload.data
                state.data = data
            })
            .addCase(fetch_All_Industry_TypeAsync.fulfilled, (state, action) => {
                let data = action.payload.data
                state.allIndustryType = data
            })
            .addCase(fetch_Industry_CompaniesAsync.fulfilled, (state, action) => {
                let industryType = action.payload.industryType
                let data = action.payload.data
                Object.entries(data).forEach(entry => {
                    const [key, value] = entry
                    state.companies[key] = value
                })
                state.industryCompanies[industryType] = data
            })
    },
});

export const { setTitle } = statisticsSlice.actions;

export const selectStatistics = (state) => state.statistics;

export default statisticsSlice.reducer;
