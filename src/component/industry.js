import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchTypeAsync,
    fetch_Industry_GrowthAsync,
    fetch_Industry_n_DaysGrowthAsync,
    fetch_Industry_CompaniesAsync,
    fetch_SubIndustry_GrowthAsync,
    fetch_SubIndustry_CompaniesAsync,
    fetchStockDetailAsync,
    fetchCompanyTypeAsync,
    getGrowth,
    getStock,
    setStockColor,
    selectIndustry
} from '../slice/industrySlice';
import { Card, Container, Row, Col, Nav, Accordion, Popover, OverlayTrigger, Button, ListGroup, Badge, Tooltip, Dropdown } from 'react-bootstrap';

export function Industry() {
    const state = useSelector(selectIndustry);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCompanyTypeAsync('上市'))
        dispatch(fetchCompanyTypeAsync('上櫃'))
        dispatch(fetchCompanyTypeAsync('興櫃'))
        dispatch(fetchTypeAsync())
        dispatch(fetch_Industry_GrowthAsync("金融")).then(() => dispatch(fetch_Industry_CompaniesAsync("金融")))
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    let industrylist = state.industry.map(industry => {
        if (state.growth[industry.industryName] === undefined) {
            dispatch(fetch_Industry_GrowthAsync(industry.industryName))
        }
        let subindustrylist = industry.subIndustries.map(subIndustry =>
            <Nav.Item key={subIndustry.subIndustryName} >
                <Nav.Link as="div" onClick={() => {
                    scrollToTop()
                    let subIndustryName = subIndustry.subIndustryName.replaceAll("/", "->");
                    if (state.growth[subIndustry.subIndustryName] === undefined) {
                        dispatch(fetch_SubIndustry_GrowthAsync([industry.industryName, subIndustryName]))
                            .then(() => dispatch(fetch_SubIndustry_CompaniesAsync([industry.industryName, subIndustryName])))
                    } else {
                        dispatch(fetch_SubIndustry_CompaniesAsync([industry.industryName, subIndustryName]))
                    }
                }}>{subIndustry.subIndustryName}</Nav.Link>
            </Nav.Item>
        )
        return (
            <Col lg={6} xxl={4} className="mb-5" key={industry.id} id={industry.id}>
                <Card className="bg-light border-0 h-100" >
                    <Card.Body className="text-center p-4 p-lg-5 pt-0 pt-lg-0" onClick={() => {
                        scrollToTop()
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
        const popover = (data) => {
            return (
                <Popover style={{ width: '15%' }}>
                    <Popover.Header as="h3">{data.key + ' ' + data.value}</Popover.Header>
                    <Popover.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item><Row><Col >公司名稱:</Col><Col >{state.panel.stock['name']}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col>股票代碼:</Col><Col>{state.panel.stock['stockcode']}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col>產業別:</Col><Col>{state.panel.stock['industryType']}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col>公司類型:</Col><Col>{state.panel.stock['companyType']}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col>股價:</Col><Col >{parseFloat(state.panel.stock['price']).toFixed(2)}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col>開盤價:</Col><Col>{parseFloat(state.panel.stock['open']).toFixed(2)}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col>最高價:</Col><Col>{parseFloat(state.panel.stock['highest']).toFixed(2)}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col >最低價:</Col><Col>{parseFloat(state.panel.stock['lowest']).toFixed(2)}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col >收盤價:</Col><Col>{parseFloat(state.panel.stock['lastprice']).toFixed(2)}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col >交易量:</Col><Col>{state.panel.stock['tradingVolume']}</Col></Row></ListGroup.Item>
                            <ListGroup.Item><Row><Col >交易日:</Col><Col>{state.panel.stock['createdTime']}</Col></Row></ListGroup.Item>
                        </ListGroup>
                    </Popover.Body>
                </Popover>
            )
        };

        let buttonColorType = (key) => {
            if (state.listedon === true && state.listed.includes(key)) {
                return 'primary'
            } else if (state.otcon === true && state.otc.includes(key)) {
                return 'info'
            } else if (state.emergingon === true && state.emerging.includes(key)) {
                return 'warning'
            } else {
                return 'link'
            }
        }

        let aColor = (key) => {
            if (state.listedon === true && state.listed.includes(key)) {
                return { color: 'white' }
            } else if (state.otcon === true && state.otc.includes(key)) {
                return { color: 'white' }
            } else if (state.emergingon === true && state.emerging.includes(key)) {
                return { color: 'white' }
            } else {
                return { color: 'blue' }
            }
        }

        const [key, value] = entry;
        return (
            <Col className="m-1" lg={2} key={key}>
                <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover({ key: key, value: value })}>
                    <Button style={{ opacity: 0.85 }}
                        variant={buttonColorType(key)}
                        onMouseEnter={() => {
                            state.stock[key] === undefined ? dispatch(fetchStockDetailAsync(key)) : dispatch(getStock(key))
                        }}>
                        <a style={aColor(key)} target="blank" href={"https://tw.stock.yahoo.com/quote/" + key + "/technical-analysis"}>{key + ' ' + value}</a>
                    </Button>
                </OverlayTrigger>
            </Col>
        )
    });

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            (1個月及3個月僅顯示上市公司漲幅)
        </Tooltip>
    );

    let industryLocationList = state.industry.map(industry => {
        return (
            <Col lg={6} key={industry.id+0}><Dropdown.Item as='div' 
            onClick={() => { document.getElementById(industry.id).scrollIntoView({ behavior: "smooth", block: "center" }) }}
        >{industry.industryName}</Dropdown.Item>
            </Col>
            
        )
    })

    return (
        <div>
            <div style={{ position: 'fixed', top: '100px', left: '20px', display: 'inline', width: '300px' }}>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" style={{color:'white'}}>
                        產業快捷選單
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Row>
                        {industryLocationList}
                        </Row>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <header className="py-5">
                <Container className="px-lg-5" >
                    <div className="p-4 p-lg-5 bg-light rounded-3 text-center" >
                        <div className="m-4 m-lg-5" style={{ textAlign: 'left' }}>
                            <h1 className="display-5 fw-bold ml-1" style={{ textAlign: 'left' }}>{state.panel.title}</h1>
                            <h4>漲幅:
                                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                                    <span>{parseFloat(state.panel.growth * 100).toFixed(2)}% </span>
                                </OverlayTrigger>
                                <Button variant="outline-light" onClick={() => dispatch(getGrowth(state.panel.title))}><Badge bg="primary" >今日</Badge></Button>
                                <Button variant="outline-light" onClick={() => dispatch(fetch_Industry_n_DaysGrowthAsync([state.panel.industryType,state.panel.subindustryName,30]))}><Badge bg="info">近1個月</Badge></Button>
                                <Button variant="outline-light" onClick={() => dispatch(fetch_Industry_n_DaysGrowthAsync([state.panel.industryType,state.panel.subindustryName,90]))}><Badge bg="warning">近3個月</Badge></Button>
                            </h4>
                            <h4 className="fs-4" >公司類別:
                                <Button variant="outline-light" onClick={() => dispatch(setStockColor('上市'))}><Badge bg="primary">上市</Badge></Button>
                                <Button variant="outline-light" onClick={() => dispatch(setStockColor('上櫃'))}><Badge bg="info" >上櫃</Badge></Button>
                                <Button variant="outline-light" onClick={() => dispatch(setStockColor('興櫃'))}><Badge bg="warning" >興櫃</Badge></Button>
                            </h4>
                            <h4 className="fs-4" style={{ textAlign: 'left' }}>公司列表:</h4>
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
