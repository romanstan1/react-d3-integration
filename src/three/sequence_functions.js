
let actOneRows = {
  right:[[]],
  left:[[]]
}

const actOne = (cube) => {

  if (cube.position.y < (-50 + (actOneRows.right.length * 4))) {
  // right:[[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],[10, 11, 12, 13, 14, 15, 16]],
  if(cube.userData.team === 'right') {
    const lastRow = actOneRows.right.length - 1
    const penultimateRow  = actOneRows.right.slice(-2,-1)[0]
    const lastValueAdded = actOneRows.right[lastRow][actOneRows.right[lastRow].length - 1]

    const penultimateRowLastValue = () => {
      if(!penultimateRow) return null
      else return penultimateRow[9]
    }
    // catch all 'old' cubes in previous rows and stop their x movement
    if(cube.userData.index < penultimateRowLastValue()) {
      cube.userData.direction.x = 0
    } else {
      if(cube.userData.direction.y === -1) {
        actOneRows.right[lastRow].push(cube.userData.index)
        cube.userData.direction.x = 1 // and change x direction to go right at postion minus 50
        if(actOneRows.right[lastRow].length > 9) {
          actOneRows.right.push([])
        }
      }
    }

    // push values into row Array, until row Array is full
    // then create new row array
    // only push anything in if x direction is not 1  or if y direction is 1,
    // do not add to rows if cubes are already travelling in the x direction

    cube.userData.direction.y = 0 // now stop y direction dead
  } else if(cube.userData.team === 'left') {

    const lastRow = actOneRows.left.length - 1
    const penultimateRow  = actOneRows.left.slice(-2,-1)[0]
    const lastValueAdded = actOneRows.left[lastRow][actOneRows.left[lastRow].length - 1]

    const penultimateRowLastValue = () => {
      if(!penultimateRow) return null
      else return penultimateRow[9]
    }
    // catch all 'old' cubes in previous rows and stop their x movement
    if(cube.userData.index < penultimateRowLastValue()) {
      cube.userData.direction.x = 0
    } else {
      if(cube.userData.direction.y === -1) {
        actOneRows.left[lastRow].push(cube.userData.index)
        cube.userData.direction.x = -1 // and change x direction to go right at postion minus 50
        if(actOneRows.left[lastRow].length > 9) {
          actOneRows.left.push([])
        }
      }
    }
    cube.userData.direction.y = 0
  }


  }

  return cube.userData.direction
}

export const directionChange = (cube) => {
  const act = 1
  switch (act) {
    case 1: return actOne(cube)
    default: return actOne(cube)
  }
}
