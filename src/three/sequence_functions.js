//
// let actOneRows = {
//   right:[[]],
//   left:[[]]
// }

// const actOne = (cube) => {
//
//   if (cube.position.y < (-50 + (actOneRows.right.length * 4))) {
//   // right:[[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],[10, 11, 12, 13, 14, 15, 16]],
//   if(cube.userData.team === 'right') {
//     const lastRow = actOneRows.right.length - 1
//     const penultimateRow  = actOneRows.right.slice(-2,-1)[0]
//     const lastValueAdded = actOneRows.right[lastRow][actOneRows.right[lastRow].length - 1]
//
//     const penultimateRowLastValue = () => {
//       if(!penultimateRow) return null
//       else return penultimateRow[10]
//     }
//     // catch all 'old' cubes in previous rows and stop their x movement
//     if(cube.userData.index < penultimateRowLastValue()) {
//       cube.userData.direction.x = 0
//     } else {
//       if(cube.userData.direction.y === -1) {
//         actOneRows.right[lastRow].push(cube.userData.index)
//         cube.userData.direction.x = 1 // and change x direction to go right at postion minus 50
//         if(actOneRows.right[lastRow].length > 10) {
//           actOneRows.right.push([])
//         }
//       }
//     }
//
//     // push values into row Array, until row Array is full
//     // then create new row array
//     // only push anything in if x direction is not 1  or if y direction is 1,
//     // do not add to rows if cubes are already travelling in the x direction
//
//     cube.userData.direction.y = 0 // now stop y direction dead
//   } else if(cube.userData.team === 'left') {
//
//     const lastRow = actOneRows.left.length - 1
//     const penultimateRow  = actOneRows.left.slice(-2,-1)[0]
//     const lastValueAdded = actOneRows.left[lastRow][actOneRows.left[lastRow].length - 1]
//
//     const penultimateRowLastValue = () => {
//       if(!penultimateRow) return null
//       else return penultimateRow[9]
//     }
//     // catch all 'old' cubes in previous rows and stop their x movement
//     if(cube.userData.index < penultimateRowLastValue()) {
//       cube.userData.direction.x = 0
//     } else {
//       if(cube.userData.direction.y === -1) {
//         actOneRows.left[lastRow].push(cube.userData.index)
//         cube.userData.direction.x = -1 // and change x direction to go right at postion minus 50
//         if(actOneRows.left[lastRow].length > 9) {
//           actOneRows.left.push([])
//         }
//       }
//     }
//     cube.userData.direction.y = 0
//   }
//
//
//   }
//
//   return cube.userData.direction
// }

// export const directionChange = (cube) => {
//   const act = 1
//   switch (act) {
//     case 1: return actOne(cube)
//     default: return actOne(cube)
//   }
// }





const actOnePosition = (coordinate, cube, velocity) => {
  let y = -1
  let x = 0
  let z = 0

  let overRideX
  let overRideY

  const rowLength = 10
  const cubeRow = Math.floor(cube.userData.index / rowLength)
  const rowRedirect = -80 + (cubeRow * cube.userData.size.y)
  const colRedirect = (cube.userData.index % rowLength) * cube.userData.size.x

  if(cube.position.y <= rowRedirect && cube.userData.team === 'left') {
    y = 0
    x = -1
    overRideY = rowRedirect
    if(cube.position.x <= colRedirect - 2) overRideX = -colRedirect - 2
  }

  if(cube.position.y <= rowRedirect && cube.userData.team === 'right') {
    y = 0
    x = 1
    overRideY = rowRedirect
    if(cube.position.x <= colRedirect + 2) overRideX = colRedirect + 2
  }

  return {
    x: overRideX || cube.position.x + (x * velocity),
    y: overRideY || cube.position.y + (y * velocity),
    z: cube.position.z + (z * velocity)
  }
}




export const positionChange = (coordinate, cube,counter, velocity) => {
  const act = 1
  switch (act) {
    case 1: return actOnePosition(coordinate,cube, velocity)
    default: return actOnePosition(coordinate,cube, velocity)
  }
}
