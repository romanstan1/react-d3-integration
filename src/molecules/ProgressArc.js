import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";

class GrandInnerChild extends Component {
  static contextTypes = {
      currentUser: PropTypes.string
  };
  render() {
    return <div>
     </div>
  }
}

class InnerChild extends Component {
  render() {
    return <div>
        <GrandInnerChild/>
     </div>
  }
}


export default class ProgressArc extends Component {
  static propTypes = {
    id: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    backgroundColor: PropTypes.string,
    foregroundColor: PropTypes.string,
    percentComplete: PropTypes.number
  };

  // static childContextTypes = {
  //   currentUser: PropTypes.string
  // };
  //
  // static methodHere() {
  //   console.log("static method",this)
  // }
  //
  // getChildContext() {
  //   return {
  //     currentUser: "My name is John"
  //   }
  // }

  componentDidMount = () => {
    this.drawArc();
  }
  componentDidUpdate = () => {
    this.redrawArc();
  }

  setForeground = (context) => {
    return context.append('path')
      .datum({ endAngle: this.tau * this.props.percentComplete })
      .style('fill', this.props.foregroundColor)
      .attr('d', this.arc());
  }
  setBackground = (context) => {
    return context.append('path')
      .datum({ endAngle: this.tau })
      .style('fill', this.props.backgroundColor)
      .attr('d', this.arc());
  }
  tau = Math.PI * 2;
  arc() {
    return d3.arc()
      .innerRadius(this.props.innerRadius)
      .outerRadius(this.props.outerRadius)
      .startAngle(0)
  }
  drawArc() {
    const context = this.setContext();
    this.setBackground(context);
    this.setForeground(context);
  }
  redrawArc() {
    const context = d3.select(`#${this.props.id}`);
    context.remove();
    this.drawArc();
  }
  setContext() {
    const { height, width, id} = this.props;
    return d3.select(this.refs.arc).append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('id', id)
      .append('g')
      .attr('transform', `translate(${height / 2}, ${width / 2})`);
  }
  render() {
    return <div ref="arc">
        <InnerChild/>
     </div>
  }
}
