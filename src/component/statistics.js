import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchStockDetailStatisticsListAsync,
    fetch_All_Industry_TypeAsync,
    fetch_Industry_CompaniesAsync,
    setTitle,
    selectStatistics
} from '../slice/statisticsSlice';
import {
    fetchCompanyTypeAsync
} from '../slice/industrySlice';
import { ComposedChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import { Row, Col, Nav, NavDropdown } from 'react-bootstrap';


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
        "tradingDate": "2022-03-17"
    },
];


export function Statistics() {
    const state = useSelector(selectStatistics)
    const listedlist = useSelector((state) => state.industry.listed)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCompanyTypeAsync('上市'))
        dispatch(fetch_All_Industry_TypeAsync()).then((action) => {
            action.payload.data.forEach(industryType => dispatch(fetch_Industry_CompaniesAsync(industryType)))
        })
        dispatch(fetchStockDetailStatisticsListAsync('2330'))
    }, [])

    let industrylist = Object.keys(state.industryCompanies).map(industryType => {
        let companylist = Object.entries(state.industryCompanies[industryType]).map(entry => {
            const [key, value] = entry
            //console.log(key, listedlist.includes(key))
            if (listedlist.includes(key)) {
                return (
                    <Col md={4}>
                        <NavDropdown.Item eventKey={key}>{key + ' ' + value}</NavDropdown.Item>
                    </Col>
                )
            }
        })
        return (
            <NavDropdown title={industryType} >
                <Row style={{ width: '450px' }}>
                    {companylist}
                </Row>
            </NavDropdown>
        )
    })

    return (
        <div>
            <header className="p-5">
                <Nav variant="pills" onSelect={(eventKey) => dispatch(fetchStockDetailStatisticsListAsync(eventKey)).then(dispatch(setTitle(eventKey)))}>
                    {industrylist}
                </Nav>
            </header>
            <section>
                <Row>
                    <Col md={12} xl={{ span: 10, offset: 1 }} style={{ height: '600px' }}>
                        <h3 style={{ textAlign: 'center' }}>{state.title}</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <ComposedChart
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
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="right" dataKey="成交筆數" fill="red" fillOpacity={0.5} />{ }
                                <Line yAxisId="left" type="monotone" dataKey="收盤" stroke="#000000" activeDot={{ r: 8 }} />
                                <Line yAxisId="left" type="monotone" dataKey="平均成本" stroke="#ac39ac"/>
                                <Line yAxisId="left" type="monotone" dataKey={state.avg5d?"平均5日成本":""} stroke="#0000ff" />
                                <Line yAxisId="left" type="monotone" dataKey={state.avg10d?"平均10日成本":""} stroke="#ff33cc" />
                                <Line yAxisId="left" type="monotone" dataKey={state.avg21d?"平均21日成本":""} stroke="#ff0000" />
                                <Line yAxisId="left" type="monotone" dataKey={state.avg62d?"平均62日成本":""} stroke="#009933" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
            </section>

        </div>

    )
}