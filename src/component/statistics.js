import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchStockDetailStatisticsListAsync,
    fetchEvaluateEntityAsync,
    fetch_All_Industry_TypeAsync,
    fetch_Industry_CompaniesAsync,
    setTitle,
    setDataAmout,
    selectStatistics
} from '../slice/statisticsSlice';
import {
    fetchCompanyTypeAsync
} from '../slice/industrySlice';
import { Row, Col, Nav, NavDropdown, DropdownButton, Dropdown } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import StockChart from './stockChart.js'
import AvgCostChart from './avgCostChart.js'
import AvgVolumeChart from './avgVolumeChart.js'
import { useSearchParams } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';

const example = [
    {
        "股票代碼": "2330",
        "名稱": "台積電",
        "收盤": 582.00,
        "開盤": 578.00,
        "最高": 583.00,
        "最低": 575.00,
        "平均成本": 579.18,
        "平均5日成本": 569.70,
        "平均10日成本": 574.26,
        "平均21日成本": 598.95,
        "平均62日成本": null,
        "平均股數": 1005.39,
        "成交筆數": 65468,
        "平均21日成交筆數": 111716,
        "tradingDate": "2022-03-17"
    },
];


export function Statistics() {
    let [searchParams, setSearchParams] = useSearchParams()
    let stockcode = searchParams.get("stockcode")
    let name = searchParams.get("name")
    const state = useSelector(selectStatistics)
    const listedlist = useSelector((state) => state.industry.listed)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCompanyTypeAsync('上市'))
        dispatch(fetch_All_Industry_TypeAsync())
            .then((action) => {
                action.payload.data.forEach(industryType => dispatch(fetch_Industry_CompaniesAsync(industryType)))
            })
            .then(() => dispatch(setTitle(stockcode + ' ' + name)))
            .then(() => dispatch(fetchStockDetailStatisticsListAsync({ stockcode: state.stockcode, days: 90 })))
            .then(() => dispatch(fetchEvaluateEntityAsync({ stockcode: state.stockcode })))
    }, [])

    let industrylist = Object.keys(state.industryCompanies).map(industryType => {
        let companylist = Object.entries(state.industryCompanies[industryType]).map(entry => {
            const [key, value] = entry
            //console.log(key, listedlist.includes(key))
            if (listedlist.includes(key)) {
                return (
                    <Col md={4} key={key + value}>
                        <NavDropdown.Item eventKey={key + ' ' + value}>{key + ' ' + value}</NavDropdown.Item>
                    </Col>
                )
            }
        })
        return (
            <NavDropdown title={industryType} key={industryType}>
                <Row style={{ width: '450px' }}>
                    {companylist}
                </Row>
            </NavDropdown>
        )
    })

    const errorChart = () => {
        return (
            <Row>
                <Col md={12} style={{ height: '500px' }}>
                    <ResponsiveContainer width="98%" height="90%">
                        <LineChart
                            width={500}
                            height={300}
                            data={state.data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="tradingDate" />
                            <YAxis yAxisId="left" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="收盤" stroke="blue" />
                            <Line yAxisId="left" type="monotone" dataKey="平均成本" stroke="red" />
                        </LineChart >
                    </ResponsiveContainer>
                </Col>
            </Row>
        )
    }

    return (
        <div>
            <header className="p-5">
                <Nav variant="pills" onSelect={(eventKey) => dispatch(fetchStockDetailStatisticsListAsync({ stockcode: eventKey.split(' ')[0], days: 90 }))
                    .then(dispatch(fetchEvaluateEntityAsync({ stockcode: eventKey.split(' ')[0] })))
                    .then(dispatch(setTitle(eventKey)))
                    .then(setSearchParams({ stockcode: eventKey.split(' ')[0],name: eventKey.split(' ')[1]}))}>
                    {industrylist}
                </Nav>
            </header>

            <section>
                <Row>
                    <Col md={{ span: 2, offset: 10 }}>
                        <DropdownButton id="dropdown-basic-button" title="顯示資料量" variant={"Info"}>
                            <Dropdown.Item onClick={() => dispatch(setDataAmout(30))}>30筆</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatch(setDataAmout(60))}>60筆</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatch(setDataAmout(90))}>90筆</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
                <h3 style={{ textAlign: 'center' }}>{state.title}</h3>
                <ErrorBoundary FallbackComponent={errorChart} resetKeys={[state.stockData]}>
                    <StockChart stockdata={state.stockData} title={state.title} />
                </ErrorBoundary>
                <div>
                    <Row>
                        <Col xl={6}>
                            <AvgCostChart />
                        </Col>
                        <Col xl={6}>
                            <AvgVolumeChart />
                        </Col>
                    </Row>
                </div>
            </section>
        </div>
    )
}