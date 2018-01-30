import React, { Component } from 'react';
// import {initializeDom, renderDom} from '../assets/similarity_scores_correlation.json'
import * as d3 from "d3";



export default class DataExperimentGraph extends Component {

 parseData = () => {
    d3.json('../similarity_scores_correlation.json', (data) => {
      console.log('data', data);
      var newData =  data
    })
  }
  render() {
    return <div onClick={this.parseData} className='innerBlock'> Data Experiement</div>
  }
}
