import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import '../css/highcharts.css';
Highcharts.setOptions({
    lang: {
        months: [
            '1月', '2月', '3月', '4月',
            '5月', '6月', '7月', '8月',
            '9月', '10月', '11月', '12月'
        ],
        shortMonths: [
            '1月', '2月', '3月', '4月',
            '5月', '6月', '7月', '8月',
            '9月', '10月', '11月', '12月'
        ]
    }
});

const StockChart=(props)=> {
    const options = {
        chart: {
            height: 400,
            styledMode: true
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    let date = new Date(this.value)
                    let formatted_date = (date.getMonth() + 1) + '/' + date.getDate()
                    return formatted_date
                },
            }
        },
        yAxis: {
            title: {
                text: '股價',
                rotation: 0,
                x: -10
            },
            labels: {
                rotation: 0
            },
            resize: {
                enabled: true
            },
            opposite: false
        },
        tooltip: {
            formatter: function () {
                let date = new Date(this.x)
                let formatted_date = (date.getMonth() + 1) + '/' + date.getDate()
                let open = this.points[0].point.open
                let close = this.points[0].point.close
                let high = this.points[0].point.high
                let low = this.points[0].point.low
                let avgCost = this.points[1].y
                return props.title +
                    '<br><b>交易日: </b>' + formatted_date +
                    '<br>開盤價: ' + open +
                    '<br>收盤價: ' + close +
                    '<br>最高: ' + high +
                    '<br>最低: ' + low +
                    '<br>平均成本: ' + avgCost
            }
        },
        series: [{
            type: 'candlestick',
            name: props.title,
            data: props.stockdata.data
        }, {
            type: 'line',
            name: props.title,
            data: props.stockdata.avgCost,
            marker: {
                enabled: true,
                radius: 2,
                lineColor: 'white'
            },
        }],
        accessibility: {
            enabled: false
        },
    }


    return (
        <div style={{ width: '90%', margin: '0 auto' }}>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={options}
            />
        </div>)

}
export default StockChart