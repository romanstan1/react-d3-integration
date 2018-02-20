import React, { Component } from 'react';
import init, {start, stop, uninitAndStop} from './three/main.js'
import './index.css'
import Nav from '../Nav'
import img from "../../assets/heightmap.png";

class Scene extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    return <div id='terrain'>
      <canvas id='canvas'></canvas>
      <img id='heightmap' src={img} alt=""/>
    </div>
  }
}

export default class Terrain extends Component {

  componentDidMount() {
    init()
  }
  componentWillUnmount() {
    uninitAndStop()
  }

  render() {
    return [
      <Scene key='scene'/>,
      <Nav key='nav'/>
    ]
  }
}
