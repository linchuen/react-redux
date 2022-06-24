import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchLeaderboardListAsync,
    selectLeaderboard
} from '../slice/leaderboardSlice';
import { Row, Col, Popover, OverlayTrigger, ListGroup, Badge } from 'react-bootstrap';

export function Leaderboard() {
    const state = useSelector(selectLeaderboard);
    const dispatch = useDispatch();

    useEffect(() => {
        let date = new Date();
        dispatch(fetchLeaderboardListAsync({ year: date.getFullYear(), month: date.getMonth() + 1 }))
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
            return (
                <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover({ key: key, value: value })} key={key}>
                    <Link to={"/statistics?stockcode=" + key} style={{ "textDecoration": "none" }}>
                        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">{key + " " + value.name}</div>
                                {"增長: " + value.ascend + " 遞減: " + value.descend}
                            </div>
                            <Badge bg="primary" pill>
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
    return (
        <div>
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
