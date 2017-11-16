import React, {Component} from 'react'
import {Link} from 'react-router-dom'

export default class Navigation extends Component {

  render () {
    return (
      <div className='navigation'>
        <div><Link to="/SimilarityNetwork"> Similarity Network</Link></div>
        <div><Link to="/HierarchicalEdge"> Hierarchical Edge Bundling</Link></div>
        <div><Link to="/ChordDiagram"> Chord Diagram</Link></div>
        <div><Link to="/DotAnimation"> Dot Animation</Link></div>
      </div>
    )
  }
}
