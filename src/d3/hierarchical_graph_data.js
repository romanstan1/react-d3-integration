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

export function createImportData(data, category) {

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
export function packageHierarchy(classes) {
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

  classes.forEach(d => find(d.name, d))

  return d3.hierarchy(map[""]);
}


// Return a list of imports for the given array of nodes.
export function packageImports(nodes) {
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
