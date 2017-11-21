import React, { Component } from 'react';
// import {initializeDom, renderDom} from '../d3/dot_animation_functions.js'
import {stop, startstop, reinit} from '../three/dot_animation_three.js'


class Graph extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    // console.log("this",this)
    return <div id='dot-canvas'></div>
  }
}

export default class DotAnimation extends Component {
  state = {
    start: false
  }
  componentDidMount() {
    reinit()
  }
  handleStartstop = () => {
    this.setState({start: !this.state.start})
    startstop()
  }
  handleInit = () => {
    this.setState({start: false})
    reinit()
  }
  componentWillUnmount() {
    stop()
  }
  render() {
    return [
      <div key='init' style={{right: '100px'}} className='draw-button' onClick={this.handleStartstop}>{this.state.start? 'Stop' : 'Start' }</div>,
      <div key='startstop' className='draw-button' onClick={this.handleInit}> Re-Init</div>,
      <Graph key='graph'/>
    ]
  }
}
