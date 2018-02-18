import React, { Component } from 'react';
import init, {start, stop} from './three/main.js'
import './index.css'

class Scene extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    return <div id='terrain'></div>
  }
}

export default class Terrain extends Component {
  state = {
    startstop: 'Stop'
  }

  componentDidMount() {
    init()
    document.addEventListener("keydown", this.handleKeydown);
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
      <div key='button' className='button' onClick={this.handleStartStop}>
        {this.state.startstop}
      </div>
    ]
  }
}
