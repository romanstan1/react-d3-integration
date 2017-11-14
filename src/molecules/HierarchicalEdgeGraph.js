import React, { Component } from 'react';
import * as d3 from "d3";

function createImportData(data) {

  const newData = data.reduce((arr, row)=> {

    const newRowName = row.material+ '.'+row.name
    const newLinkRowName = row.linkMaterial+ '.'+row.linkName

    const indexOfName = arr.findIndex((findRow)=> newRowName === findRow.name)

    if(indexOfName === -1) {
      return arr.concat({
        category: row.material,
        name: row.material+ '.' +row.name,
        imports: [newLinkRowName]
      })
    } else {
      arr[indexOfName].imports.push(newLinkRowName)
      return arr
    }
  },[])

  return newData;
}




// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  classes.forEach(function(d) {
    find(d.name, d);
  });

  return d3.hierarchy(map[""]);
}


// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.data.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.data.imports) d.data.imports.forEach(function(i) {
      imports.push(map[d.data.name].path(map[i]));
    });
  });

  return imports;
}


export default class HierarchicalEdgeGraph extends Component {
    componentDidMount() {
      const diameter = window.innerWidth
      const radius = diameter / 2
      const innerRadius = radius - 80

      const cluster = d3.cluster()
          .size([360, innerRadius]);

      const line = d3.radialLine()
          .curve(d3.curveBundle.beta(0.85))
          .radius(function(d) { return d.y; })
          .angle(function(d) { return d.x / 180 * Math.PI; });

      const svg = d3.select("div#flare").append("svg")
          .attr("width", diameter)
          .attr("height", diameter)
          .append("g")
          .attr("transform", "translate(" + radius + "," + radius + ")");

      let link = svg.append("g").selectAll(".link")
      let node = svg.append("g").selectAll(".node")

      d3.csv('../HierarchicalEdge.csv', function(error, classes) {
        var newRoot = createImportData(classes)
        var root = packageHierarchy(newRoot)
        cluster(root)
        var previousLink
        var linkFreq = 1
        link = link
          .data(packageImports(root.leaves()))
          .enter().append("path")
          .each((d) => {
            d.source = d[0]
            d.target = d[d.length - 1]
          })
          .attr("class", "link")
          .attr("stroke-width", d => {
            const currentLink = d.source.data.key + '-' + d.target.data.key
            if(currentLink === previousLink) linkFreq = linkFreq * 2
            else linkFreq = 1
            previousLink = currentLink
            return linkFreq
          })
          .attr("d", line);

      node = node
        .data(root.leaves())
        .enter().append("text")
          .attr("class", "node")
          .attr("dy", "0.31em")
          .attr("transform", (d) => "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"))
          .attr("text-anchor", (d) => d.x < 180 ? "start" : "end")
          .text((d) => d.data.key)
          .on("mouseover", mouseovered)
          .on("mouseout", mouseouted);
      })

      function mouseovered(d) {
        node.each((n) => {n.target = n.source = false})

        link
          .classed("link--target", (l) => { if (l.target === d) return l.source.source = true})
          .classed("link--source", (l) => { if (l.source === d) return l.target.target = true})
          .filter((l) => l.target === d || l.source === d).raise()

        node
          .classed("node--target", n => n.target)
          .classed("node--source", n => n.source)
      }

      function mouseouted(d) {
        link
          .classed("link--target", false)
          .classed("link--source", false)

        node
          .classed("node--target", false)
          .classed("node--source", false)
      }



    }
    shouldComponentUpdate(nextProps) {
        return false;
    }
    render() {
        return (
            // <svg width={window.innerWidth} height={window.innerHeight}></svg>
            <div id='flare'></div>
            // </div>
        )
    }
}
