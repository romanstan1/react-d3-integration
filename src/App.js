import React, { Component } from 'react';
import {ProgressArc} from './matrix'

class App extends Component {
  state = {percentComplete: 0.3}

  togglePercent = () => {
    const percentage = this.state.percentComplete === 0.3 ? 0.7 : 0.3
    this.setState({percentComplete: percentage})
  }

  render() {
    console.log(this.state.percentComplete);
    return [
      <a key='link' onClick={this.togglePercent}>Toggle Arc</a>,
      <ProgressArc
        key='arc'
        height={300}
        width={300}
        innerRadius={100}
        outerRadius={110}
        id="d3-arc"
        backgroundColor="#e6e6e6"
        foregroundColor="#00ff00"
        percentComplete={this.state.percentComplete}
      />
    ]
  }
}

export default App;
