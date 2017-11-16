import React, {Component} from 'react';
import {ProgressArc, SimilarityNetwork, HierarchicalEdgeGraph, ChordDiagram, DotAnimation} from '../matrix'

export class SimilarityNetworkPage extends Component {
  render() {
    return [
      <div id='similarity-network' key='network' className='similarity-network'>
        <SimilarityNetwork
          id="similarity-network"
          dimensions={{height:window.innerHeight, width:window.innerWidth}}
        />
      </div>
    ]
  }
}
export class ChordDiagramPage extends Component {
  render() {
    return [
      <div id='chord-diagram' key='chord-diagram' className='chord-diagram'>
        <ChordDiagram
          id="chord-diagram"
          dimensions={{height:window.innerHeight, width:window.innerWidth}}
        />
      </div>
    ]
  }
}
export class DotAnimationPage extends Component {
  render() {
    return [
      <div id='dot-animation' key='dot-animation' className='dot-animation'>
        <DotAnimation
          id="dot-animation"
          dimensions={{height:window.innerHeight, width:window.innerWidth}}
        />
      </div>
    ]
  }
}

export class HierarchicalEdgePage extends Component {
  render() {
    return [
      <div key='edge' className='hierarchical-edge'>
        <HierarchicalEdgeGraph
          id="similarity-network"
          dimensions={{height:window.innerHeight, width:window.innerWidth}}
        />
      </div>
    ]
  }
}

export class ProgressArcPage extends Component {
  state = {percentComplete: 0.3}

  togglePercent = () => {
    const percentage = this.state.percentComplete === 0.3 ? 0.7 : 0.3
    this.setState({percentComplete: percentage})
  }

  render() {
    return [
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
