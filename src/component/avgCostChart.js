import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setAvg5d,
    setAvg10d,
    setAvg21d,
    setAvg62d,
    selectStatistics
} from '../slice/statisticsSlice';
import { ComposedChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import { Row, Col } from 'react-bootstrap';

export default function AvgCostChart() {
    const state = useSelector(selectStatistics)
    const dispatch = useDispatch()
    return (
        <div>
            <h4 style={{ textAlign: 'center' }}>平均交易成本&交易量</h4>
            <Row>
                <Col md={12} style={{ height: '500px' }}>
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
                            <Bar yAxisId="right" dataKey="成交筆數" fill="red" fillOpacity={0.5} />
                            <Line yAxisId="left" type="monotone" dataKey="收盤" stroke="#663300" />
                            <Line yAxisId="left" type="monotone" dataKey={state.avg5d ? "平均5日成本" : ""} stroke="#0066ff" />
                            <Line yAxisId="left" type="monotone" dataKey={state.avg10d ? "平均10日成本" : ""} stroke="#e60073" />
                            <Line yAxisId="left" type="monotone" dataKey={state.avg21d ? "平均21日成本" : ""} stroke="#ff9933" />
                            <Line yAxisId="left" type="monotone" dataKey={state.avg62d ? "平均62日成本" : ""} stroke="#009933" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </Col>
                <Col md={{span:11,offset:1}}>
                    <div className="form-check m-2" style={{display:"inline-block"}}>
                        <input className="form-check-input" type="checkbox" onChange={() => { dispatch(setAvg5d()) }} />
                        <label className="form-check-label">平均5日成本</label>
                    </div>
                    <div className="form-check m-2" style={{display:"inline-block"}}>
                        <input className="form-check-input" type="checkbox" value="平均10日成本" onChange={() => { dispatch(setAvg10d()) }} />
                        <label className="form-check-label">平均10日成本</label>
                    </div>
                    <div className="form-check m-2" style={{display:"inline-block"}}>
                        <input className="form-check-input" type="checkbox" value="平均21日成本" onChange={() => { dispatch(setAvg21d()) }} />
                        <label className="form-check-label">平均21日成本</label>
                    </div>
                    <div className="form-check m-2" style={{display:"inline-block"}}>
                        <input className="form-check-input" type="checkbox" value="平均62日成本" onChange={() => { dispatch(setAvg62d()) }} />
                        <label className="form-check-label">平均62日成本</label>
                    </div>
                </Col>
            </Row>
        </div>
    )
}