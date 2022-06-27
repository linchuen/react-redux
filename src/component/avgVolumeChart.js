import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setAvg10dVol,
    setAvg21dVol,
    setAvgShareSD,
    selectStatistics
} from '../slice/statisticsSlice';
import { ComposedChart, Line, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import { Row, Col } from 'react-bootstrap';

export default function AvgVolumeChart() {
    const state = useSelector(selectStatistics)
    const dispatch = useDispatch()

    let sdLines = []
    let avgShareSDList = state.avgShareSDList
    for (let i = 0; i < avgShareSDList.length - 1; i++) {
        if (i === 2) {
            sdLines.push(<ReferenceLine key={i} yAxisId="right" y={state.avgShareSDList[i]} stroke="#808080" label={state.avgShareSD ? "AVG" : ""} strokeWidth={state.avgShareSD ? 1 : 0} />)
        } else {
            sdLines.push(<ReferenceLine key={i} yAxisId="right" y={state.avgShareSDList[i]} stroke="#808080" strokeWidth={state.avgShareSD ? 1 : 0} />)
        }
    }
    return (
        <div>
            <h4 style={{ textAlign: 'center' }}>交易量&平均股數</h4>
            <Row>
                <Col md={12} style={{ height: '500px' }}>
                    <ResponsiveContainer width="100%" height="90%">
                        <ComposedChart
                            width={500}
                            height={300}
                            data={state.data.slice(-state.dataAmout)}
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
                            <Bar yAxisId="right" dataKey="平均股數" fill="#ff9933" fillOpacity={0.5} />
                            <Line yAxisId="left" type="monotone" dataKey={"成交筆數"} stroke="#009933" />
                            <Line yAxisId="left" type="monotone" dataKey={state.avg10dVol ? "平均10日成交筆數" : ""} stroke="#0000ff" />
                            <Line yAxisId="left" type="monotone" dataKey={state.avg21dVol ? "平均21日成交筆數" : ""} stroke="#ff33cc" />
                            {sdLines}
                        </ComposedChart>
                    </ResponsiveContainer>
                </Col>
                <Col md={{ span: 11, offset: 1 }}>
                    <div className="form-check m-2 d-inline-flex">
                        <input className="form-check-input" type="checkbox" onChange={() => { dispatch(setAvg10dVol()) }} />
                        <label className="form-check-label">平均10日成交筆數</label>
                    </div>
                    <div className="form-check m-2 d-inline-flex">
                        <input className="form-check-input" type="checkbox" onChange={() => { dispatch(setAvg21dVol()) }} />
                        <label className="form-check-label">平均21日成交筆數</label>
                    </div>
                    <div className="form-check m-2 d-inline-flex">
                        <input className="form-check-input" type="checkbox" onChange={() => { dispatch(setAvgShareSD()) }} />
                        <label className="form-check-label">平均股數準差</label>
                    </div>
                </Col>
            </Row>
        </div>
    )
}