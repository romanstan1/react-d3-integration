import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import correlationData from '../assets/json/similarity_scores_correlation.json'

const simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody(-50).distanceMin(50).distanceMax(1000))
    .force("link", d3.forceLink().id((d) => {
        return d.index
    } ))
    .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    .force("y", d3.forceY(0.001))
    .force("x", d3.forceX(0.001))


class Graph extends Component {
    componentDidMount() {
        simulation.on("tick", () => {
            this.nodes.attr("transform", d =>`translate(${d.x},${d.y})`)


            this.links
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        })
    }

    ticked() {
        // this.links
        //     .attr("x1", function(d) { return d.source.x; })
        //     .attr("y1", function(d) { return d.source.y; })
        //     .attr("x2", function(d) { return d.target.x; })
        //     .attr("y2", function(d) { return d.target.y; });

        this.nodes
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    shouldComponentUpdate(nextProps) {
        this.graph = d3.select(this.refs.graph)

        console.log("nextProps",nextProps)
        this.links = this.graph
            .attr("class", "link")
            .selectAll("line")
            .data(nextProps.links, (link) => link.key)
            .enter()
            .append("line")
            .attr("stroke", "black")

        this.nodes = this.graph
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nextProps.nodes)
            .enter().append("circle")
            .attr("r", 13)
            .on('click', (d) => {
                console.log("d",d)
            })


        simulation.nodes(nextProps.nodes)
        // .on("tick", this.ticked);
        simulation.force("link").links(nextProps.links);

        return false;
    }
    render() {
    const {width, height} = this.props.dimensions
      return (
        <svg width={width} height={height}>
          <g ref='graph' />
        </svg>
      )
    }

}

const nodeData = Object.keys(correlationData).map((product, index) => {
    return {
        'id': product,
        'similar_glasses': correlationData[product]
    }
})

const linkData = nodeData.reduce((linksArray, node) => {
    return linksArray.concat(
        Object.entries(node.similar_glasses).map(keyValuePair => {
            return {
                'source': node.id,
                'target': keyValuePair[0],
                'strength': keyValuePair[1],
                'key': node.id + ',' + keyValuePair[0]
            }
        })
    )
},[])

export default class SimilarityNetwork extends Component {
    state = {
        nodeData:[],
        linkData:[]
    }
    componentDidMount() {
       this.updateData()
    }
    //
    updateData() {
        this.setState({nodeData, linkData})
    }

    render() {
        return (
            <Graph
                dimensions={this.props.dimensions}
                nodes={this.state.nodeData}
                links={this.state.linkData}/>
        )
  }
}
