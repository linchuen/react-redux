import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {
    fetch_All_Industry_TypeAsync,
    selectStatistics
} from '../slice/statisticsSlice';
import {
    fetchLeaderboardListAsync,
    fetchStockDetailAsync,
    setAvgOption,
    setIndustryOption,
    setIsFiliter,
    selectLeaderboard
} from '../slice/leaderboardSlice';
import { Row, Col, Popover, Button, OverlayTrigger, ListGroup, Badge } from 'react-bootstrap';
import { transferIndustryType } from '../api/commonAPI';

export function Leaderboard() {
    const state = useSelector(selectLeaderboard);
    const statisticsState = useSelector(selectStatistics);
    const dispatch = useDispatch();
    let [min, setMin] = useState(10)
    let [max, setMax] = useState(60)

    useEffect(() => {
        let date = new Date()
        dispatch(fetchLeaderboardListAsync({ year: date.getFullYear(), month: date.getMonth() + 1 })).then((action) => {
            let data = action.payload.data
            let rankArray = Object.keys(data[0]).concat(Object.keys(data[1])).concat(Object.keys(data[2])).concat(Object.keys(data[3]))
            let stockpriceArray = new Set(rankArray)
            stockpriceArray.forEach(stockcode => {
                if (state.rankStock[stockcode] === undefined) {
                    dispatch(fetchStockDetailAsync(stockcode))
                }
            })
        })
        dispatch(fetch_All_Industry_TypeAsync())
    }, [])

    const topRankItem = (topRankList) => {
        return Object.entries(topRankList).map(entry => {
            const [key, value] = entry
            const popover = (data) => {
                return (
                    <Popover style={{ 'fontSize': '16px' }}>
                        <Popover.Body>
                            <div><b className='pr-4'>名稱:</b> {data.value.name}</div>
                            <div><b className='pr-4'>產業別:</b> {data.value.industryType}</div>
                            <div><b className='pr-4'>上市時間:</b> {data.value.timeToMarket}</div>
                            <div><b className='pr-4'>簡介:</b> {data.value.desciption}</div>
                        </Popover.Body>
                    </Popover>
                )
            };

            const filter = (data) => {
                if (state.isFiliter) {
                    let industryResult = true
                    if (!state.industryOption.length === 0) {
                        industryResult = state.industryOption.findIndex(i => i === data.value.industryType || i === transferIndustryType(data.value.industryType)) === 0
                    }
                    let avgResult = true
                    let pricebetween = true
                    let price = state.rankStock[data.key].price
                    if (max > min && (price < min || price > max)) {
                        pricebetween = false
                    } else if (min > max && (price < max || price > min)) {
                        pricebetween = false
                    }

                    state.avgOption.forEach(type => {
                        if (type === "ma5AboveMA10") {
                            avgResult = data.value.ma5AboveMA10 ? avgResult : false
                        } else if (type === "ma10AboveMA21") {
                            avgResult = data.value.ma10AboveMA21 ? avgResult : false
                        } else if (type === "ma21AboveMA62") {
                            avgResult = data.value.ma21AboveMA62 ? avgResult : false
                        }
                    })

                    if (industryResult && avgResult && pricebetween) {
                        return (
                            true
                        )
                    }
                }
            };


            return (
                <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover({ key: key, value: value })} key={key}>
                    <Link to={"/statistics?stockcode=" + key + "&name=" + value.name} style={{ "textDecoration": "none" }}>
                        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">{key + " " + value.name}</div>
                                {"增長: " + value.ascend + " 遞減: " + value.descend}
                            </div>
                            <span className={filter({ key: key, value: value }) ? "mx-2 dot" : "mx-2"}></span>
                            <Badge bg={Object.keys(state.intersectionRank).includes(key) ? "warning" : "primary"} pill>
                                {value.industryType}
                            </Badge>
                        </ListGroup.Item>
                    </Link>
                </OverlayTrigger>
            )
        })
    }
    let ma5TopRankItem = topRankItem(state.ma5Top100Rank)
    let ma10TopRankItem = topRankItem(state.ma10Top100Rank)
    let ma21TopRankItem = topRankItem(state.ma21Top100Rank)
    let ma62TopRankItem = topRankItem(state.ma62Top100Rank)

    const industryTypeArr = Object.values(statisticsState.allIndustryType).map(industryType => {
        return (
            <div className="form-check m-2 d-inline-flex" key={industryType}>
                <input className="form-check-input" type="checkbox" onChange={() => { dispatch(setIndustryOption(industryType)) }} />
                <label className="form-check-label">{industryType}</label>
            </div>
        )
    })

    return (
        <div>
            <Row className='my-5'>
                <Col md={{ span: 8, offset: 2 }}>
                    <h4>篩選器:</h4>
                    <ListGroup as="ol">
                        <ListGroup.Item as="li" className="d-flex border-0">
                            <div>
                                <div>股價:</div>
                                <div>{min}</div>
                                <input type="range" className="form-range" min="0" max="150" value={min} onChange={(e) => { setMin(e.target.value) }} style={{ width: '1000px' }} />
                                <div>{max}</div>
                                <input type="range" className="form-range" min="0" max="150" value={max} onChange={(e) => { setMax(e.target.value) }} style={{ width: '1000px' }} />
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item as="li" className="d-flex border-0" >
                            <div>產業:{industryTypeArr}</div>
                        </ListGroup.Item>
                        <ListGroup.Item as="li" className="d-flex border-0">
                            <div>均線:
                                <div className="form-check m-2 d-inline-flex">
                                    <input className="form-check-input" type="checkbox" onChange={() => { dispatch(setAvgOption("ma5AboveMA10")) }} />
                                    <label className="form-check-label">5日均大於10日均</label>
                                </div>
                                <div className="form-check m-2 d-inline-flex">
                                    <input className="form-check-input" type="checkbox" onChange={() => { dispatch(setAvgOption("ma10AboveMA21")) }} />
                                    <label className="form-check-label">10日均大於21日均</label>
                                </div>
                                <div className="form-check m-2 d-inline-flex">
                                    <input className="form-check-input" type="checkbox" onChange={() => { dispatch(setAvgOption("ma21AboveMA62")) }} />
                                    <label className="form-check-label">21日均大於62日均</label>
                                </div>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                    <div className="form-check form-switch m-1 fs-5">
                        <input className="form-check-input" type="checkbox" role="switch" onChange={() => dispatch(setIsFiliter())} />
                        <label className="form-check-label" >啟用</label>
                    </div>
                </Col>
            </Row>
            <Row className='my-5'>
                <Col md={{ span: 2, offset: 2 }}>
                    <h4 style={{ "textAlign": "center" }}>5日排行</h4>
                    <ListGroup as="ol" numbered>
                        {ma5TopRankItem}
                    </ListGroup>
                </Col>
                <Col md={2}>
                    <h4 style={{ "textAlign": "center" }}>10日排行</h4>
                    <ListGroup as="ol" numbered>
                        {ma10TopRankItem}
                    </ListGroup>
                </Col>
                <Col md={2}>
                    <h4 style={{ "textAlign": "center" }}>21日排行</h4>
                    <ListGroup as="ol" numbered>
                        {ma21TopRankItem}
                    </ListGroup>
                </Col>
                <Col md={2}>
                    <h4 style={{ "textAlign": "center" }}>62日排行</h4>
                    <ListGroup as="ol" numbered>
                        {ma62TopRankItem}
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );
}
