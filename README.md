# Quick-Charts

Quick Charts is a simple chart library built with React and D3.

![example](https://user-images.githubusercontent.com/4142016/163662694-03199150-8fc3-40a8-8839-4d67b01e0c3a.png)

- Timeline
- ScatterPlot
- Histogram

## Installation

NPM
```bash
npm install @islubee/quick-charts@1.0.4
```

## Usage

```react
import React from "react"
import { TimelineData, ScatterData } from "./dummyData"

import { Timeline, ScatterPlot, Histogram } from "@islubee/quick-charts"

import "./styles.css"

const dateAccessor = d => d.date
const temperatureAccessor = d => d.temperature
const humidityAccessor = d => d.humidity

const App = () => {
  return (
    <div className="App">
      <h1>
        Weather Dashboard
      </h1>
      <div className="App__charts">
        <Timeline
          data={TimelineData}
          xAccessor={dateAccessor}
          yAccessor={temperatureAccessor}
          label="Temperature"
        />
        <ScatterPlot
          data={ScatterData}
          xAccessor={humidityAccessor}
          yAccessor={temperatureAccessor}
          xLabel="Humidity"
          yLabel="Temperature"
        />
        <Histogram
          data={ScatterData}
          xAccessor={humidityAccessor}
          label="Humidity"
        />
      </div>
    </div>
  )
}

export default App
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
