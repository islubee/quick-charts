import React, { useState, useEffect, useRef } from "react"
import { storiesOf } from '@storybook/react';
import {Timeline, ScatterPlot, Histogram} from '../src';
import './styles.css'
import * as d3 from 'd3';
import { getTimelineData, getScatterData } from "./dummyData"

const stories = storiesOf('App Test', module);
const parseDate = d3.timeParse("%m/%d/%Y")
const dateAccessor = d => parseDate(d.date)
const temperatureAccessor = d => d.temperature
const humidityAccessor = d => d.humidity

const getData = () => ({
  timeline: getTimelineData(),
  scatter: getScatterData(),
})

stories.add('App', () => {
  const [data, setData] = useState(getData())
  
  useInterval(() => {
    console.log(data);
    setData(getData())
  }, 4000)
return  <div className="App">
    <h1>
      Weather Dashboard
    </h1>
    <div className="App__charts">
      <Timeline
        data={data.timeline}
        xAccessor={dateAccessor}
        yAccessor={temperatureAccessor}
        label="Temperature"
      />
      <ScatterPlot
        data={data.scatter}
        xAccessor={humidityAccessor}
        yAccessor={temperatureAccessor}
        xLabel="Humidity"
        yLabel="Temperature"
      />
      <Histogram
        data={data.scatter}
        xAccessor={humidityAccessor}
        label="Humidity"
      />
    </div>
    </div>

})
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}