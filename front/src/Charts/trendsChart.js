import { useEffect, useState } from 'react';
import CanvasJSReact from '../Assets/canvasjs.react';
import * as ROUTES from '../constant/routes'
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function TrendsCharts() {	
    
    const data = [[10000.0, 10172.359999999999, 10287.1, 10103.929999999998, 10163.539999999999],
                [6000.0, 6754.3, 8503.1, 7582.9, 7856.5],
                [8500.0, 8306.6, 10287.1, 7513.8, 8698.539999999999],
                [9000.0, 9500.359999999999, 9236.1, 9105.929999999998, 9051.539999999999],
                [8120.0, 7530.39, 7980.1, 8021.998, 7898.]]
    var random = Math.floor(Math.random() * 5)

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: "Trends in last 5 days"
        },
        axisY: {
            title: "Price",
            suffix: "$"
        },
        axisX: {
            title: "date",
            prefix: "Day",
            interval: 1
        },
        data: [{
            type: "line",
            toolTipContent: "Day {x}: {y}",
            dataPoints: [
                { x: 1, y: data[random][0] },
                { x: 2, y: data[random][1] },
                { x: 3, y: data[random][2] },
                { x: 4, y: data[random][4] },
                { x: 5, y: data[random][3] },
            ]
        }]
    }
          
     return (
        <div>
          <CanvasJSChart options = {options} />
        </div>
      );
  }

  export default TrendsCharts