import * as d3 from "d3";
import {packageImports, packageHierarchy,createImportData} from './hierarchical_graph_data.js'

let cluster, line, svg, link, node

export function initializeDom() {
  const width = window.innerWidth
  const diameter = window.innerHeight
  const radius = diameter / 2.1
  const innerRadius = (radius) - 60

  cluster = d3.cluster()
      .size([360, innerRadius]);

  line = d3.radialLine()
      .curve(d3.curveBundle.beta(0.87))
      .radius(d => d.y)
      .angle(d => d.x / 180 * Math.PI)

  svg = d3.select("div#flare").append("svg")
      .attr("width", width)
      .attr("height", diameter + 50)
      .append("g")
      .attr("transform", "translate(" + ( width / 2) + "," + (diameter / 2) + ")");
}

function mouseover(d) {
  node.each( n => {
    n.target = n.source = false
  })

  link
    .classed("link--target", (l) => { if (l.target === d) return l.source.source = true})
    .classed("link--source", (l) => { if (l.source === d) return l.target.target = true})
    .filter((l) => l.target === d || l.source === d).raise()

  node
    .classed("node--target", n => n.target)
    .classed("node--source", n => n.source)
}

function mouseout(d) {
  link
    .classed("link--target", false)
    .classed("link--source", false)

  node
    .classed("node--target", false)
    .classed("node--source", false)
}

function click(d) {
  const angle = d3.randomUniform(1, 360)
  d.x = d.x + angle()
  moveNode()
}

function moveNode() {
  node
    .attr("transform", (d) => "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"))
    .attr("text-anchor", (d) => d.x < 180 ? "start" : "end")
  link.attr("d", line)
}


function render(data) {
  const newData = []

  data.forEach((item, i) => {

    if(!!item.firstCount) {
      for(i = 0; i < item.firstCount; i++) {
        newData.push({
          name:item.aRef, linkName: item.first,

          gender:'Female',
          color:'Red',
          linkColor: 'Red',
          linkGender: 'Male',
          linkMaterial:'Metal',
          material:'Acetate'
        })
      }
    }

   if(!!item.secondCount) {

     for( i = 0; i < item.secondCount; i++) {
       newData.push({
         name:item.aRef, linkName: item.second,

         gender:'Male',
         color:'Black',
         linkColor: 'Black',
         linkGender: 'Male',
         linkMaterial:'Acetate',
         material:'Acetate',
         style: 'Round',
         linkStyle: 'Round'
       })
     }
   }
  })

  return newData
}


// export function renderDom(category) {
//   d3.csv('../actualData.csv', (data) => {
//     render(data)
//     console.log("category newData", category, newData)
//     renderDomProperly(category,newData)
//   })
// }

export function renderDom(category) {

  d3.csv('../actualData.csv', (error, classes) => {
    const newData = render(classes)
    console.log("newData",newData)
  })
  d3.csv('../HierarchicalEdge.csv', (error, classes) => {
  // d3.csv('../actualData.csv', (error, classes) => {
  //
    console.log("classes",classes)
    svg.select("g").remove()

    const root = packageHierarchy(createImportData(classes, category))
    cluster(root)
    // console.log("packageImports(root.leaves())",packageImports(root.leaves()))

    let previousLink
    let linkFreq = 1

     link = svg.append("g").selectAll(".link")
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

    const categoryMiddles = root.children.map(category => {
      let categoryLength = category.children.length
      if (categoryLength%2 !== 0) categoryLength ++
      return category.children[categoryLength / 2]
    })

    node = svg.append("g")
      .attr("class", "node-group")
      .selectAll(".node")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("class", "node")
      .attr("dy", "0.31em")
      .text((d) => {
        // console.log("d",d.parent.children.length)
        // console.log("d",d.parent.data.name)
        return d.data.key
      })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", click)
      // .append("text")

      const g = d3.select(".node-group")


    // console.log("categoryMiddles",categoryMiddles)
    // categoryMiddles.


      categoryMiddles.forEach((c) => {
        // console.log(c.x, c.y)
        g.append("g")
        .attr("transform", (d) =>
          "rotate(" + (c.x - 90) + ")translate(" + (c.y + 60) + ",-20)rotate(90)")
        .append("text")
         .attr("class", "category-title")
         .attr("dy", "0.31em")
         .text((d) => c.parent.data.name)
         // .attr("transform","translate(50,0)")

         // .attr("transform", (d) =>
         //   "rotate(" + (c.x) + ")")

         // .attr("text-anchor", (d) => d.x < 180 ? "start" : "end")
         // .attr("x", d => cat.x + 40)
         // .attr("y", d => cat.y)
      })
    // categoryMiddles
    //   .each( (d) => {
    //     console.log("d",d)
    //   })

    moveNode()
  })
}
