import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUrl } from '../api/commonAPI';

export const fetchStockDetailStatisticsListAsync = createAsyncThunk(
    'statistics/fetchStockDetailStatisticsListAsync',
    async (param) => {
        let stockcode = param.stockcode
        let days = param.days
        let data = await fetchUrl('http://127.0.0.1:8080/statistics/' + stockcode + '/' + days)
        console.log(data)
        return { stockcode: stockcode, data: data }
    }
);

export const fetchEvaluateEntityAsync = createAsyncThunk(
    'statistics/fetchEvaluateEntityAsync',
    async (param) => {
        let stockcode = param.stockcode
        let data = await fetchUrl('http://127.0.0.1:8080/evaluate/' + stockcode)
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
    stockcode:'2330',
    companies: {},
    avg5d: false,
    avg10d: false,
    avg21d: false,
    avg62d: false,
    avg10dVol: false,
    avg21dVol: false,
    avgShareSD: false,
    data: [],
    dataAmout: 90,
    stockData: {
        data: [],
        avgCost: []
    },
    avgShareSDList: [],
    ma5SlopeList: [],
    ma10SlopeList: [],
    ma21SlopeList: [],
    ma62SlopeList: []
};

export const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload
            state.stockcode = action.payload.split(' ')[0]
        },
        setAvg5d: (state, action) => {
            state.avg5d = !state.avg5d
        },
        setAvg10d: (state, action) => {
            state.avg10d = !state.avg10d
        },
        setAvg21d: (state, action) => {
            state.avg21d = !state.avg21d
        },
        setAvg62d: (state, action) => {
            state.avg62d = !state.avg62d
        },
        setAvg10dVol: (state, action) => {
            state.avg10dVol = !state.avg10dVol
        },
        setAvg21dVol: (state, action) => {
            state.avg21dVol = !state.avg21dVol
        },
        setAvgShareSD: (state, action) => {
            state.avgShareSD = !state.avgShareSD
        },
        setDataAmout: (state, action) => {
            let amout = action.payload
            state.dataAmout = amout
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStockDetailStatisticsListAsync.fulfilled, (state, action) => {
                let data = action.payload.data
                state.stockData.data = []
                state.stockData.avgCost = []
                data.forEach(object => {
                    let arr = []
                    arr.push(Date.parse(object.tradingDate))
                    arr.push(object.開盤)
                    arr.push(object.最高)
                    arr.push(object.最低)
                    arr.push(object.收盤)
                    state.stockData.data.push(arr)

                    let avgCost = []
                    avgCost.push(Date.parse(object.tradingDate))
                    avgCost.push(object.平均成本)
                    state.stockData.avgCost.push(avgCost)
                })
                state.data = data
            })
            .addCase(fetchEvaluateEntityAsync.fulfilled, (state, action) => {
                let data = action.payload.data
                state.avgShareSDList = data.avgShareSDList
                state.ma5SlopeList = data.ma5SlopeList
                state.ma10SlopeList = data.ma10SlopeList
                state.ma21SlopeList = data.ma21SlopeList
                state.ma62SlopeList = data.ma62SlopeList
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

export const { setTitle, setAvg5d, setAvg10d, setAvg21d, setAvg62d, setAvg10dVol, setAvg21dVol, setAvgShareSD, setDataAmout } = statisticsSlice.actions;

export const selectStatistics = (state) => state.statistics;

export default statisticsSlice.reducer;
