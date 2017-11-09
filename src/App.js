import React, { Component } from 'react';
import {ProgressArc, SimilarityNetwork} from './matrix'

class App extends Component {
  state = {percentComplete: 0.3}

  togglePercent = () => {
    const percentage = this.state.percentComplete === 0.3 ? 0.7 : 0.3
    this.setState({percentComplete: percentage})
  }

  render() {
    return [
      <div id='similarity-network' key='network' className='similarity-network'>
        <SimilarityNetwork
          id="similarity-network"
          dimensions={{height:window.innerHeight, width:window.innerWidth}}
        />
      </div>,
      <div key='arc' className='progress-arc'>
        <a onClick={this.togglePercent}>Toggle Arc</a>
        <ProgressArc
          height={300}
          width={300}
          innerRadius={100}
          outerRadius={110}
          id="d3-arc"
          backgroundColor="#e6e6e6"
          foregroundColor="#00ff00"
          percentComplete={this.state.percentComplete}
        />
      </div>
    ]
  }
}

export default App;
