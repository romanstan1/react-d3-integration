import React, { Component } from 'react';
import init, {start, stop, uninitAndStop} from './three/main.js'
import Nav from '../Nav'
import './index.css'

class Scene extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    return <div id='terrain'></div>
  }
}

export default class ThreeDSnake extends Component {
  state = {
    startstop: 'Stop'
  }

  componentDidMount() {
    init()
    document.addEventListener("keydown", this.handleKeydown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
    uninitAndStop()
  }

  handleStartStop = () => {
    const {startstop} = this.state
    if(startstop === 'Stop') {
      this.setState({startstop: 'Start'})
      stop()
    } else {
      this.setState({startstop: 'Stop'})
      start()
    }
  }

  handleKeydown = (e) => {
    if(e.code === 'Space') {
      this.handleStartStop()
    }
  }

  render() {
    return [
      <Scene key='scene'/>,
      <Nav key='nav'/>,
      <div key='button' className='button' onClick={this.handleStartStop}>
        {this.state.startstop}
      </div>
    ]
  }
}
