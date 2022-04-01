import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchTypeAsync,
    selectIndustry
} from '../slice/industrySlice';
import { Card, Container, Row, Col } from 'react-bootstrap';

export function Industry() {
    const state = useSelector(selectIndustry);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTypeAsync())
    }, [])
    let industrylist=state.industry.map(industry =>
        <Col lg={6} xxl={4} className="mb-5" key={industry.id}>
            <Card className="bg-light border-0 h-100">
                <Card.Body className="text-center p-4 p-lg-5 pt-0 pt-lg-0">
                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-4 mt-n4"><i className="bi bi-collection"></i></div>
                    <Card.Title className="fs-4 fw-bold">{industry.industryName}</Card.Title>
                    <Card.Text className="mb-0">
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>);

    return (
        <div>
            <header className="py-5">
                <Container className="px-lg-5">
                    <div className="p-4 p-lg-5 bg-light rounded-3 text-center">
                        <div className="m-4 m-lg-5">
                            <h1 className="display-5 fw-bold">A warm welcome!</h1>
                            <p className="fs-4">Bootstrap utility classNamees are used to create this jumbotron since the old component has been removed from the framework. Why create custom CSS when you can use utilities?</p>
                            <a className="btn btn-primary btn-lg" href="#!">Call to action</a>
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
