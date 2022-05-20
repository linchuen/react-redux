import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUrl } from '../api/industryAPI';

export const fetchStockDetailAsync = createAsyncThunk(
    'stock/fetchStockDetail',
    async (stockcode) => {
        const data = await fetchUrl('http://localhost:8080/stock/' + stockcode)
        console.log(stockcode, data)
        return { stockcode: stockcode, data: data }
    }
);

export const fetchTypeAsync = createAsyncThunk(
    'industry/fetchType',
    async () => {
        const data = await fetchUrl('http://localhost:8080/industry/all')
        console.log(data)
        return data
    }
);

export const fetch_Industry_GrowthAsync = createAsyncThunk(
    'industry/fetchIndustryGrowth',
    async (industryType) => {
        //const data = await fetchUrl('http://localhost:8080/industry/growth/金融')
        //const data = await fetchUrl('http://localhost:8080/industry/growth/'+industryType)
        const data = await fetchUrl('http://localhost:8080/industry/growth/listed?Days=1&Type='+industryType)
        console.log(industryType, data)
        let json = { industryType: industryType, data: data }
        return json
    }
);

export const fetch_SubIndustry_GrowthAsync = createAsyncThunk(
    'industry/fetchSubIndustryGrowthAsync',
    async (param) => {
        let [industryType, subIndustry] = param
        //const data = await fetchUrl('http://localhost:8080/industry/growth/金融/證券業')
        //const data = await fetchUrl('http://localhost:8080/industry/growth/'+industryType+'/'+subIndustry)
        const data = await fetchUrl('http://localhost:8080/industry/growth/listed?Days=1&Type='+industryType+'&SubType='+subIndustry)
        console.log(industryType, subIndustry, data)
        let json = { subIndustry: subIndustry, data: data }
        return json
    }
);

export const fetch_Industry_n_DaysGrowthAsync = createAsyncThunk(
    'industry/fetchIndustry1MonthGrowthAsync',
    async (param) => {
        let [industryType, subIndustry, days] = param
        if (subIndustry === '') {
            //const data = await fetchUrl('http://localhost:8080/industry/growth/listed?Days=' + days + '&Type=金融')
            const data = await fetchUrl('http://localhost:8080/industry/growth/listed?Days='+ days + '&Type='+industryType)
            console.log(industryType, subIndustry, days, data)
            let json = { industryType: industryType, subIndustry: subIndustry, days: days, data: data }
            return json
        } else {
            //const data = await fetchUrl('http://localhost:8080/subindustry/growth/listed?Days=' + days + '&Type=金融&SubType=證券業')
            const data = await fetchUrl('http://localhost:8080/industry/growth/listed?Days' + days + '&Type='+industryType+'&SubType='+subIndustry)
            console.log(industryType, subIndustry, days, data)
            let json = { industryType: industryType, subIndustry: subIndustry, data: data }
            return json
        }

    }
);

export const fetch_Industry_CompaniesAsync = createAsyncThunk(
    'industry/fetchIndustryCompaniesAsync',
    async (industryType) => {
        const data = await fetchUrl('http://localhost:8080/industry/stockInfo/' + industryType)
        console.log(industryType, data)
        let json = { industryType: industryType, data: data }
        return json
    }
);

export const fetch_SubIndustry_CompaniesAsync = createAsyncThunk(
    'industry/fetchSubIndustryCompaniesAsync',
    async (param) => {
        let [industryType, subIndustry] = param
        const data = await fetchUrl('http://localhost:8080/industry/stockInfo/' + industryType + '/' + subIndustry)
        console.log(industryType, subIndustry, data)
        let json = { industryType: industryType, subIndustry: subIndustry, data: data }
        return json
    }
);

export const fetchCompanyTypeAsync = createAsyncThunk(
    'industry/fetchCompanyTypeAsync',
    async (companyType) => {
        const data = await fetchUrl('http://localhost:8080/stock/?companyType=' + companyType)
        console.log(companyType, data)
        let json = { companyType: companyType, data: data }
        return json
    }
);

const initialState = {
    industry: [],
    stock: {},
    growth: {
        oneMonth: {},
        threeMonth: {}
    },
    panel: {
        title: '金融',
        industryType: '金融',
        subindustryName: '',
        growth: 0,
        companies: [],
        stock: {}
    },
    listed: [],
    otc: [],
    emerging: [],
    listedon: false,
    otcon: false,
    emergingon: false
};

export const industrySlice = createSlice({
    name: 'industry',
    initialState,
    reducers: {
        getGrowth: (state, action) => {
            state.panel.growth = state.growth[action.payload]
        },
        getStock: (state, action) => {
            state.panel.stock = state.stock[action.payload]
        },
        setStockColor: (state, action) => {
            let companyType = action.payload
            if (companyType === '上市') {
                state.listedon = !state.listedon
            } else if (companyType === '上櫃') {
                state.otcon = !state.otcon
            } else {
                state.emergingon = !state.emergingon
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTypeAsync.fulfilled, (state, action) => {
                state.industry = action.payload
            })
            .addCase(fetch_Industry_GrowthAsync.fulfilled, (state, action) => {
                let industryType = action.payload.industryType
                let data = action.payload.data
                state.growth[industryType] = data
            })
            .addCase(fetch_SubIndustry_GrowthAsync.fulfilled, (state, action) => {
                let subIndustry = action.payload.subIndustry
                let data = action.payload.data
                state.growth[subIndustry] = data
            })
            .addCase(fetch_Industry_n_DaysGrowthAsync.fulfilled, (state, action) => {
                let industryType = action.payload.industryType
                let subIndustry = action.payload.subIndustry
                let days = action.payload.days
                let data = action.payload.data
                if (days === 30) {
                    if (subIndustry === '') {
                        state.growth.oneMonth[industryType] = data
                    } else {
                        state.growth.oneMonth[subIndustry] = data
                    }
                } else if (days === 90) {
                    if (subIndustry === '') {
                        state.growth.threeMonth[industryType] = data
                    } else {
                        state.growth.threeMonth[subIndustry] = data
                    }
                }
                state.panel.growth = data
            })
            .addCase(fetch_Industry_CompaniesAsync.fulfilled, (state, action) => {
                let industryType = action.payload.industryType
                let data = action.payload.data
                state.panel.title = industryType
                state.panel.growth = state.growth[industryType]
                state.panel.companies = data
                state.panel.industryType = industryType
                state.panel.subIndustryName = ''
            })
            .addCase(fetch_SubIndustry_CompaniesAsync.fulfilled, (state, action) => {
                let industryType = action.payload.industryType
                let subIndustry = action.payload.subIndustry
                let data = action.payload.data
                state.panel.title = subIndustry.replaceAll("->", "/")
                state.panel.growth = state.growth[subIndustry]
                state.panel.companies = data
                state.panel.industryType = industryType
                state.panel.subIndustryName = subIndustry
            })
            .addCase(fetchStockDetailAsync.fulfilled, (state, action) => {
                let stockcode = action.payload.stockcode
                let data = action.payload.data
                state.stock[stockcode] = data
                state.panel.stock = data
                if (!action.payload.data) {
                    state.stock[stockcode] = {}
                    state.panel.stock = {}
                }
            })
            .addCase(fetchCompanyTypeAsync.fulfilled, (state, action) => {
                let companyType = action.payload.companyType
                let data = action.payload.data

                if (companyType === '上市') {
                    state.listed = data
                } else if (companyType === '上櫃') {
                    state.otc = data
                } else {
                    state.emerging = data
                }
            })
    },
});

export const { getGrowth, getStock, setStockColor } = industrySlice.actions;

export const selectIndustry = (state) => state.industry;

export default industrySlice.reducer;
