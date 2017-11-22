import React, { Component } from 'react';
import {stop, startstop, reinit, helper} from '../three/dot_animation_three.js'


class Graph extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
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
  handleHelper = () => {
    helper()
  }
  componentWillUnmount() {
    stop()
  }
  render() {
    return [
      <div key='init' style={{right: '100px'}} className='draw-button' onClick={this.handleStartstop}>{this.state.start? 'Stop' : 'Start' }</div>,
      <div key='startstop' className='draw-button' onClick={this.handleInit}> Re-Init</div>,
      <div style={{right: '300px', width: '150px'}} key='helper' className='draw-button' onClick={this.handleHelper}> Light & Shadow Helpers</div>,
      <Graph key='graph'/>
    ]
  }
}
