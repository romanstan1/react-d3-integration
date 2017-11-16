import React, { Component } from 'react';
import {initializeDom, renderDom} from '../d3/chord_diagram_functions.js'

const CategoryButton = ({handleClick, value, category}) => {
  const className = value === category? 'button active' : 'button'
  return <div onClick={handleClick} data-value={value} className={className}> {value}</div>
}

class Graph extends Component {
  componentDidMount() {
    initializeDom()
  }
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    return <div key='vis' id='chord'></div>
  }
}

export default class ChordDiagram extends Component {

  state = {
    otherState: this.props,
    category: null
  }
  handleClick = (e) => {
    this.setState({category:e.target.dataset.value})
    renderDom(e.target.dataset.value)
  }
  render() {
    const {category} = this.state
    return [
      <div key='buttons' className='select-category'>
        <div className='title'>Categorize glasses by: </div>
        {['Material', 'Gender', 'Color', 'Style'].map((item) =>
          <CategoryButton value={item} key={item} handleClick={this.handleClick} category={category}/>
        )}
      </div>,
      <Graph key='graph'/>
    ]
  }
}
