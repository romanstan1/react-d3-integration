import * as d3 from "d3";

let svg
// let nodes

const width = window.innerWidth
const height = window.innerHeight

export function initializeDom() {

    svg = d3.select("div#dot-amination").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        // .attr("width", width)
        // .attr("height", height)
        .attr("transform", "translate(" + ((width) / 2) + "," + (height / 2) + ")")
}

export function renderDom() {
    // const simulation = d3.forceSimulation()
    //     .force("charge", d3.forceManyBody().strength(-16.04))
    //     // .force("collide",  d3.forceCollide( d => 16))
    //     .force("center", d3.forceCenter(width / 2, height / 2))
    //     .force("y", d3.forceY().strength(0.04))
    //     .force("x", d3.forceX().strength(0.03))

    let matrix = [
        12,23,12,7,8,12,54,23,34,45,74,2,12,3,12,3,22,12,32,12,
        74,2,12,3,12,3,22,12,32,12,74,2,12,3,12,3,22,12,32,12,
        12,23,12,7,8,12,54,23,34,45,74,2,12,3,12,3,22,12,32,12,
        74,2,12,3,12,3,22,12,32,12,74,2,12,3,12,3,22,12,32,12,
        12,23,12,7,8,12,54,23,34,45,74,2,12,3,12,3,22,12,32,12,
        74,2,12,3,12,3,22,12,32,12,74,2,12,3,12,3,22,12,32,12,
        12,23,12,7,8,12,54,23,34,45,74,2,12,3,12,3,22,12,32,12,
        74,2,12,3,12,3,22,12,32,12,74,2,12,3,12,3,22,12,32,12,
        12,23,12,7,8,12,54,23,34,45,74,2,12,3,12,3,22,12,32,12,
        74,2,12,3,12,3,22,12,32,12,74,2,12,3,12,3,22,12,32,12,
        12,23,12,7,8,12,54,23,34,45,74,2,12,3,12,3,22,12,32,12,
        74,2,12,3,12,3,22,12,32,12,74,2,12,3,12,3,22,12,32,12
    ];

    matrix = matrix.map((item, i) => {
        return {
            value: item,
            index: i
        }
    })

    // const middleIndex = matrix[(matrix.length ) / 2].index
    // console.log("middleIndex",middleIndex)
    svg
        .selectAll(".node")
        .data(matrix)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("opacity", "0.7")
        .attr("r", 2)
        .attr("cx", (d) => ((d.index%20)) * 40)
        .attr("cy", (d) => Math.floor(d.index / 20) * 33)
        // .attr("transform",`translate(120,100)`)
        // .attr("transform", (d) => {
        // const transform = d.index - middleIndex
        //     return `translate(${transform*2},${0})`
        // })
        .on('click', (d) => {
            console.log("d",d)
        })

    // simulation.nodes(matrix)

    // console.log("matrix",matrix)
    // simulation.on("tick", () => {
    //     nodes.attr("transform", d =>`translate(${d.x},${d.y})`)
    // })

}
