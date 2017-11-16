import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import * as d3 from "d3";
import correlationData from '../assets/json/similarity_scores_correlation.json'

const simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody())
    .force("collide",  d3.forceCollide( d => 14))
    .force("link", d3.forceLink()
        .id(d => d.index)
        .distance(d=> d.strength* 0.01)
    )
    // .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    .force("y", d3.forceY(window.innerHeight / 1.7).strength(0.04))
    .force("x", d3.forceX(window.innerWidth / 2).strength(0.03))

class Graph extends Component {
    componentDidMount() {
    simulation.on("tick", () => {
        this.nodes.attr("transform", d =>`translate(${d.x},${d.y})`)
        this.links
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
        })
    }

    shouldComponentUpdate(nextProps) {
        console.log("nextProps",nextProps)
        this.graph = d3.select(this.refs.graph)
        this.graph.selectAll("*").remove()

        this.links = this.graph
            .selectAll(".link")
            .data(nextProps.links)
            .enter().append("line")
            .attr("class", "link")

        this.nodes = this.graph
            .selectAll(".node")
            .data(nextProps.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 12)
            .on('click', (d) => {
                console.log("d",d)
            })


        simulation.nodes(nextProps.nodes)
        simulation.force("link").links(nextProps.links);

        return false;
    }
    render() {
    const {width, height} = this.props.dimensions
      return (
        <svg ref='svg' width={width} height={height}>
          <g ref='graph' />
        </svg>
      )
    }
}


const nodeData = Object.keys(correlationData).map((product, index) => {
    return {
        'id': product,
        'similar_glasses': correlationData[product],
        index
    }
})

const getNodeIndex = (id) => {
    return nodeData.filter((node)=>node.id === id)[0].index
}

const linkData = nodeData.reduce((linksArray, node) => {
    return linksArray.concat(
        Object.entries(node.similar_glasses).map(keyValuePair => {
            return {
                'source_id': node.id,
                'target_id': keyValuePair[0],
                'strength': keyValuePair[1],
                'source': getNodeIndex(node.id),
                'target': getNodeIndex(keyValuePair[0])
            }
        })
    )
},[])


const nodeCount = 100;
const nodes = [];
for (let i = 0; i < nodeCount; i++) {
  nodes.push({
    x: 0,
    y: 0
  });
}

// const links = [];
// for (let i = 0; i < nodeCount; i++) {
//   let target = 0;
//   do {
//     target = Math.floor(Math.random() * nodeCount);
//   } while(target == i)
//   links.push({
//     source: i,
//     target
//   });
// }
// console.log("nodeData",nodeData)
// // console.log("links",links)
// console.log("linkData",linkData)

export default class SimilarityNetwork extends Component {
    state = {
        nodeData:[],
        linkData:[]
    }
    componentDidMount() {
        console.log("this SimilarityNetwork mounted")
       this.updateData()
    }
    componentWillUnmount() {
        // console.log("this SimilarityNetwork UNNmounted")
         // this.setState({nodeData:[], linkData:[]})
         // d3.select('svg').selectAll("*").remove();
    }
    updateData() {
       this.setState({nodeData, linkData})
    }
    handleClick = () => {
        console.log("this",this)
       this.setState({nodeData:[], linkData:[]})
    }

    render() {
        return (
          <span>
            <Graph
                dimensions={this.props.dimensions}
                nodes={this.state.nodeData}
                links={this.state.linkData}
              />
          </span>
        )
    }
}
