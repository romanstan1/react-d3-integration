import React, { Component } from 'react';
import * as d3 from "d3";

function categoryForRow(row, category) {
  switch(category) {
    case 'Material': return row.material+ '.'+ row.name
    case 'Gender': return row.gender+ '.'+ row.name
    case 'Color': return row.color+ '.'+ row.name
    case 'Style': return row.style+ '.'+ row.name
    default: return row.material+ '.'+ row.name
  }
}

function categoryForLinkRow(row, category) {
  switch(category) {
    case 'Material': return row.linkMaterial+ '.'+ row.linkName
    case 'Gender': return row.linkGender+ '.'+ row.linkName
    case 'Color': return row.linkColor+ '.'+ row.linkName
    case 'Style': return row.linkStyle+ '.'+ row.linkName
    default: return row.linkMaterial+ '.'+ row.linkName
  }
}

function createImportData(data, category) {

  const newData = data.reduce((arr, row)=> {

    const newRowName = categoryForRow(row, category)
    const newLinkRowName = categoryForLinkRow(row, category)
    const indexOfName = arr.findIndex((findRow)=> newRowName === findRow.name)

    if(indexOfName === -1) {
      return arr.concat({
        name: newRowName,
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


var diameter, radius, innerRadius, cluster, line, svg


function initializeDom() {
  console.log("window.innerHeight",window.innerHeight)
  diameter = window.innerHeight
  radius = diameter / 2
  innerRadius = radius - 60

  cluster = d3.cluster()
      .size([360, innerRadius]);

  line = d3.radialLine()
      .curve(d3.curveBundle.beta(0.85))
      .radius(function(d) { return d.y; })
      .angle(function(d) { return d.x / 180 * Math.PI; });

  svg = d3.select("div#flare").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");
}


function renderDom(category) {

  svg.select("g").remove()
  svg.select("g").remove()

  let link = svg.append("g").selectAll(".link")
  let node = svg.append("g").selectAll(".node")

  d3.csv('../HierarchicalEdge.csv', (error, classes) => {
    var newRoot = createImportData(classes, category)
    var root = packageHierarchy(newRoot)
    cluster(root)

    // link.exit().remove()
    // node.exit().remove()

    // console.log("link",link)

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
      .attr("d", line)

    node = node
      .data(root.leaves())
      .enter().append("text")
      .attr("class", "node")
      .attr("dy", "0.31em")
      .attr("transform", (d) => "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"))
      .attr("text-anchor", (d) => d.x < 180 ? "start" : "end")
      .text((d) => d.data.key)
      .on("mouseover", mouseovered)
      .on("mouseout", mouseouted)
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
    return <div key='vis' id='flare'></div>
  }
}

export default class HierarchicalEdgeGraph extends Component {

  state = {
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
