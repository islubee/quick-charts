![NPM Package](https://img.shields.io/npm/v/quick-charts?color=green&label=npm%20package)
![CI](https://img.shields.io/github/workflow/status/islubee/quick-charts/Node.js%20CI?logo=GITHUB)
![bundlesize](https://img.shields.io/bundlephobia/min/quick-charts)
![lastcommit]( https://img.shields.io/github/last-commit/islubee/quick-charts)

 # Quick-Charts

Quick Charts is a simple chart library built with React and D3.

- Timeline
- ScatterPlot
- Histogram

## Installation

NPM
```bash
npm i quick-charts
```

## Usage

```JavaScript
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
