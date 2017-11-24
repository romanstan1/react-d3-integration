import {halfRowLength} from './modules'
import * as d3 from 'd3'
import {cubicOut, cubicIn,linear, cubicInOut, elasticInOut, quartInOut, quartIn, quartOut} from 'eases'
import _ from 'lodash'

let value = true
let value2 = true

const actOne = (cube, velocity) => {
  let y = -1
  let x = 0
  let z = 0
  let overRideX
  let overRideY
  const centeringTheCube = (halfRowLength * cube.userData.size.y) - 2
  const rowRedirect = (cube.userData.rowIndex * cube.userData.size.y) - centeringTheCube
  const colRedirect = (cube.userData.index % halfRowLength) * cube.userData.size.x

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


// if(value && cube.userData.index === 0) {
//   console.log("cube",cube)
//   value = false
// }














const actTwo = (cube, velocity) => {
  let y = 1
  let x = 1
  let z = 0
  const gapSize = 8

  let direction = -1
    if(cube.userData.team === 'right') direction = 1

  const yDirection = cube.userData.centralProximity / Math.abs(cube.userData.centralProximity)

// establish prior positions for x and y
  const centeringTheCube = (halfRowLength * cube.userData.size.y) - 2
  const rowRedirect = (cube.userData.rowIndex * cube.userData.size.y) - centeringTheCube

  // let yPrior = cube.userData.centralProximity + (cube.userData.rowIndex * cube.userData.size.y)
  let yPrior = rowRedirect * -1
  let xPrior = (cube.userData.index % halfRowLength) * cube.userData.size.x
    if(cube.userData.team === 'right' ) xPrior = xPrior + 2
    else xPrior = (xPrior * direction) - 2

// targets for x and y
  const xTarget =  xPrior * gapSize
  const yTarget = (cube.userData.centralProximity - (yDirection * 0.5)) * cube.userData.size.y * gapSize

// ease and increment to positions
  const xScale = d3.scaleLinear().domain([xPrior, xTarget])
  const yScale = d3.scaleLinear().domain([yPrior, yTarget])


  const yAbs = cube.position.y + (y * yDirection)
  const yVal = yScale(yAbs)
  const yEased = cubicOut(yVal)
  const newYIncrement = (yEased/yVal)

  const xAbs = cube.position.x + (x * direction)
  const xVal = xScale(xAbs)
  const xEased = cubicOut(xVal)
  const newXIncrement = (xEased/xVal)

  let overRideX = xTarget
  let overRideY = yTarget

  if(xTarget > cube.position.x + newXIncrement) overRideX = cube.position.x + newXIncrement
  else if (xTarget < cube.position.x - newXIncrement) overRideX = cube.position.x - newXIncrement

  if(yTarget > cube.position.y + newYIncrement) overRideY = cube.position.y + newYIncrement
  else if (yTarget < cube.position.y - newYIncrement) overRideY = cube.position.y - newYIncrement

  if(value && cube.userData.team === 'right' && cube.userData.index === 4) {
    // console.log("cube 4",cube, cube.position, newYIncrement, yAbs, yVal)
    console.log("cube 49 p and t",yPrior, yTarget, cube.userData.centralProximity )
    // console.log("prox, row index, size", cube.userData.centralProximity, cube.userData.rowIndex, cube.userData.size.y)

    value = false
  }
  if(value2 && cube.userData.team === 'right' && cube.userData.index === 49) {
    // console.log("cube 49",cube, cube.position, newYIncrement, yAbs, yVal)
    console.log("cube 49 p and t",yPrior, yTarget, cube.userData.centralProximity )
    // console.log("prox, row index, size", cube.userData.centralProximity, cube.userData.rowIndex, cube.userData.size.y)
    value2 = false
  }
  return {
    x: overRideX,
    y: overRideY,
    z: cube.position.z + (z * velocity)
  }
}

const actThree = (cube, velocity) => {

  let x = 0
  let y = 0
  let z = 0

  let overRideX
  let overRideY

  if(cube.userData.team === 'left' && cube.userData.index < 5) {
    overRideX = cube.userData.size.x * cube.userData.index
    overRideY = 0
  } else {
    overRideX = 100
    overRideY = 100
  }
  return {
    x: overRideX,
    y: overRideY,
    // x: overRideX || cube.position.x + (x * velocity),
    // y: overRideY || cube.position.y + (y * velocity),
    z: cube.position.z + (z * velocity)
  }
}



const actRandom = (cube, velocity) => {

  let x = 0
  let y = 0
  let z = 0
  x = _.random(-0.5, 0.5)
  y = _.random(-0.5, 0.5)
  z = _.random(-0.5, 0.5)

  return {
    x: cube.position.x + (x * velocity),
    y: cube.position.y + (y * velocity),
    z: cube.position.z + (z * velocity)
  }
}

export const positionChange = (cube, velocity, act) => {
  switch (act) {
    case 1: return actOne(cube, velocity)
    case 2: return actTwo(cube, velocity)
    case 3: return actThree(cube, velocity)
    default: return actRandom(cube, velocity)
  }
}
