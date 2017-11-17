import React, { Component } from 'react';
// import {initializeDom, renderDom} from '../d3/dot_animation_functions.js'
import {run} from '../three/dot_animation_three.js'

//
// class Graph extends Component {
//   componentDidMount() {
//     run()
//   }
//   shouldComponentUpdate(nextProps) {
//     return false;
//   }
//   render() {
//     return <canvas id='dot-animation'></canvas>
//   }
// }

export default class DotAnimation extends Component {
  componentDidMount() {
    run()
  }
  handleClick = () => {
  }
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    return <div id='dot-canvas'></div>
  }
}
