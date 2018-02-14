import React, { Component } from 'react';
// import {stop, startstop, reinit, helper, nextAct} from './dot_animation_three.js'


class Graph extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    return <div id='dot-canvas'></div>
  }
}

export default class Animation extends Component {
  state = {
    start: false,
    act:1
  }
  // componentDidMount() {
  //   reinit()
  // }
  // handleStartstop = () => {
  //   this.setState({start: !this.state.start})
  //   startstop()
  // }
  // handleInit = () => {
  //   this.setState({start: false, act: 1})
  //   reinit()
  //   nextAct(1)
  // }
  // handleHelper = () => {
  //   helper()
  // }
  // handleNextact = () => {
  //   this.setState({act: this.state.act + 1})
  //   nextAct(this.state.act + 1)
  // }
  // componentWillUnmount() {
  //   stop()
  // }
  render() {
    return [
      // <div key='init' style={{right: '100px'}} className='draw-button' onClick={this.handleStartstop}>{this.state.start? 'Stop' : 'Start' }</div>,
      // <div key='startstop' className='draw-button' onClick={this.handleInit}> Re-Init</div>,
      // <div style={{right: '190px', width: '150px'}} key='helper' className='draw-button' onClick={this.handleHelper}> Light & Shadow Helpers</div>,
      // <div style={{top:'40px', width: '150px'}} key='next' className='draw-button' onClick={this.handleNextact}> Current Act {this.state.act} - Next</div>,
      <Graph key='graph'/>
    ]
  }
}
