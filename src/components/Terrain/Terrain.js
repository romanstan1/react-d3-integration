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
  }
  handleClick = () => {
    const {startstop} = this.state
    if(startstop === 'Stop') {
      this.setState({startstop: 'Start'})
      stop()
    } else {
      this.setState({startstop: 'Stop'})
      start()
    }
  }
  render() {

    return [
      <Scene key='scene'/>,
      <div key='button' className='button' onClick={this.handleClick}>{this.state.startstop}</div>
    ]
  }
}
