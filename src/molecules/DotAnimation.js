import React, { Component } from 'react';
import {initializeDom, renderDom} from '../d3/dot_animation_functions.js'

class Graph extends Component {
  componentDidMount() {
    initializeDom()
    renderDom()
  }
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    return <div key='vis' id='dot-amination'></div>
  }
}

export default class DotAnimation extends Component {
  handleClick = () => {
  }

  render() {
    return [
      <Graph key='graph'/>
    ]
  }
}
