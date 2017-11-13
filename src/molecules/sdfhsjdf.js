class MyGraph extends React.Component {
  constructor(props) {
  	super(props);
    this.state = {
    	nodes: props.nodes,
      links: props.links
    };
  }

  componentDidMount() {
    this.force = d3.forceSimulation(this.state.nodes)
      .force("charge",
        d3.forceManyBody()
          .strength(this.props.forceStrength)
      )
      .force("link",
        d3.forceLink().distance(this.props.linkDistance).links(this.state.links)
      )
      .force("x", d3.forceX(this.props.width / 2))
      .force("y", d3.forceY(this.props.height / 2));

    this.force.on('tick', () => this.setState({
    	links: this.state.links,
    	nodes: this.state.nodes
    }));
  }

  componentWillUnmount() {
    this.force.stop();
  }

	render() {
    return (
    	<svg width={this.props.width} height={this.props.height}>
      	{this.state.links.map((link, index) =>(
          <line
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            key={`line-${index}`}
            stroke="black" />
        ))}
      	{this.state.nodes.map((node, index) =>(
        	<circle r={node.r} cx={node.x} cy={node.y} fill="red" key={index}/>
        ))}
      </svg>
    );
  }
}

MyGraph.defaultProps = {
  width: 300,
  height: 300,
  linkDistance: 30,
  forceStrength: -20
};

const nodeCount = 100;
const nodes = [];
for (let i = 0; i < nodeCount; i++) {
  nodes.push({
  	r: (Math.random() * 5 ) + 2,
    x: 0,
    y: 0
  });
}

const links = [];
for (let i = 0; i < nodeCount; i++) {
  let target = 0;
  do {
    target = Math.floor(Math.random() * nodeCount);
  } while(target == i)
  links.push({
    source: i,
    target
  });
}

console.log(links);

ReactDOM.render(
  <MyGraph nodes={nodes} links={links} />,
  document.getElementById('container')
);
