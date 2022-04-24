import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchTypeAsync,
    fetch_Industry_GrowthAsync,
    fetch_Industry_CompaniesAsync,
    fetch_SubIndustry_GrowthAsync,
    fetch_SubIndustry_CompaniesAsync,
    fetchStockDetailAsync,
    selectIndustry
} from '../slice/industrySlice';
import { Card, Container, Row, Col, Nav, Accordion, Popover, OverlayTrigger, Button, ListGroup } from 'react-bootstrap';

export function Industry() {
    const state = useSelector(selectIndustry);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTypeAsync())
        dispatch(fetch_Industry_GrowthAsync("金融")).then(() => dispatch(fetch_Industry_CompaniesAsync("金融")))
    }, [])
    let industrylist = state.industry.map(industry => {
        dispatch(fetch_Industry_GrowthAsync(industry.industryName))
        let subindustrylist = industry.subIndustries.map(subIndustry =>
            <Nav.Item key={subIndustry.subIndustryName} >
                <Nav.Link as="div" onClick={() => {
                    let subIndustryName = subIndustry.subIndustryName.replace("/", "->");
                    dispatch(fetch_SubIndustry_GrowthAsync([industry.industryName, subIndustryName])).then(() => dispatch(fetch_SubIndustry_CompaniesAsync([industry.industryName, subIndustryName])))
                }}>{subIndustry.subIndustryName}</Nav.Link>
            </Nav.Item>
        )
        return (
            <Col lg={6} xxl={4} className="mb-5" key={industry.id} >
                <Card className="bg-light border-0 h-100">
                    <Card.Body className="text-center p-4 p-lg-5 pt-0 pt-lg-0" onClick={() => {
                        dispatch(fetch_Industry_CompaniesAsync(industry.industryName))
                    }}>
                        <div className="feature bg-primary bg-gradient text-white rounded-3 mb-4 mt-n4"><i className="bi bi-collection"></i></div>
                        <Card.Title className="fs-4 fw-bold">{industry.industryName}</Card.Title>
                        <Card.Text className="mb-0" as='h3'>
                            今日漲幅:{parseFloat(state.growth[industry.industryName] * 100).toFixed(2)}%
                        </Card.Text>
                        <Accordion className="mt-5">
                            <Accordion.Item eventKey="0" onClick={(e) => e.stopPropagation()}>
                                <Accordion.Header>子產業類別</Accordion.Header>
                                <Accordion.Body>
                                    <Nav fill>
                                        {subindustrylist}
                                    </Nav>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Card.Body>
                </Card>
            </Col >
        )
    });
    let companies = Object.entries(state.panel.companies).map(entry => {
        const [key, value] = entry;
        const popover = (title) => {
            return (
                <Popover style={{ width: '15%' }}>
                    <Popover.Header as="h3">{title}</Popover.Header>
                    <Popover.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row>
                                    <Col >公司名稱:</Col><Col >{state.stock['name']}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>股票代碼:</Col><Col>{state.stock['stockcode']}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>股價:</Col><Col >{parseFloat(state.stock['price']).toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>開盤價:</Col><Col>{parseFloat(state.stock['open']).toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>最高價:</Col><Col>{parseFloat(state.stock['highest']).toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col >最低價:</Col><Col>{parseFloat(state.stock['lowest']).toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col >收盤價:</Col><Col>{parseFloat(state.stock['lastprice']).toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col >交易量:</Col><Col>{state.stock['tradingVolume']}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col >交易日:</Col><Col>{state.stock['createdTime']}</Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Popover.Body>
                </Popover>
            )
        };
        return (
            <Col lg={2} key={key}>
                <OverlayTrigger trigger="hover" placement="right" overlay={popover(key + ' ' + value)}>
                    <Button variant="link" onMouseEnter={() => dispatch(fetchStockDetailAsync(key))}>{key + ' ' + value}</Button>
                </OverlayTrigger>
            </Col>
        )
    });

    return (
        <div>
            <header className="my-5" style={{ position: 'sticky', top: '0', zIndex: '98' }}>
                <Container className="px-lg-5" >
                    <div className="p-4 p-lg-5 bg-light rounded-3 text-center" >
                        <div className="m-4 m-lg-5" style={{ textAlign: 'left' }}>
                            <h1 className="display-5 fw-bold ml-1" style={{ textAlign: 'left' }}>{state.panel.title}</h1>
                            <h3>今日漲幅:{parseFloat(state.panel.growth * 100).toFixed(2)}%</h3>
                            <p className="fs-4" style={{ textAlign: 'left' }}>公司列表:</p>
                            <Row className="fs-5">{companies}</Row>
                        </div>
                    </div>
                </Container>
            </header>
            <section className="pt-4">
                <Container className="px-lg-5">
                    <Row className="gx-lg-5">
                        {industrylist}
                    </Row>
                </Container>
            </section>
        </div>
    );
}
