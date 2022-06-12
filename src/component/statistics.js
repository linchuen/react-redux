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
import { Row, Col, Nav, NavDropdown, DropdownButton, Dropdown } from 'react-bootstrap';
import StockChart from './stockChart.js'
import AvgCostChart from './avgCostChart.js'
import AvgVolumeChart from './avgVolumeChart.js'

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
    const state = useSelector(selectStatistics)
    const listedlist = useSelector((state) => state.industry.listed)
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(fetchCompanyTypeAsync('上市'))
        dispatch(fetch_All_Industry_TypeAsync()).then((action) => {
            action.payload.data.forEach(industryType => dispatch(fetch_Industry_CompaniesAsync(industryType)))
        })
        dispatch(fetchStockDetailStatisticsListAsync({ stockcode: state.title.split(' ')[0], days: 90 }))
    }, [])

    let industrylist = Object.keys(state.industryCompanies).map(industryType => {
        let companylist = Object.entries(state.industryCompanies[industryType]).map(entry => {
            const [key, value] = entry
            //console.log(key, listedlist.includes(key))
            if (listedlist.includes(key)) {
                return (
                    <Col md={4} key={key + value}>
                        <NavDropdown.Item eventKey={key}>{key + ' ' + value}</NavDropdown.Item>
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

    return (
        <div>
            <header className="p-5">
                <Nav variant="pills" onSelect={(eventKey) => dispatch(fetchStockDetailStatisticsListAsync({stockcode: eventKey, days: 90})).then(dispatch(setTitle(eventKey)))}>
                    {industrylist}
                </Nav>
            </header>
            <section>
                <h3 style={{ textAlign: 'center' }}>{state.title}</h3>
                <Row>
                    <Col md={{ span: 2, offset: 10 }}>
                        <DropdownButton id="dropdown-basic-button" title="顯示資料量" variant={"Info"}>
                            <Dropdown.Item>30筆</Dropdown.Item>
                            <Dropdown.Item>60筆</Dropdown.Item>
                            <Dropdown.Item>90筆</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
                <StockChart stockdata={state.stockData} title={state.title}/>
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