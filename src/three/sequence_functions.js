import {halfRowLength} from './modules'

const actOne = (cube, velocity) => {
  let y = -1
  let x = 0
  let z = 0
  let overRideX
  let overRideY
  const centeringTheCube = (halfRowLength * cube.userData.size.y) - 1
  const cubeRow = Math.floor(cube.userData.index / halfRowLength)
  const rowRedirect = -centeringTheCube + (cubeRow * cube.userData.size.y)
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

let value = true
let value2 = true

const actTwo = (cube, velocity) => {
  let y = 1.1
  let x = 1.5
  let z = 0
  const gapSize = 8
  const centeringTheCube = (halfRowLength * cube.userData.size.y) - 1
  const cubeRow = Math.floor(cube.userData.index / halfRowLength)
  const rowRedirect = -centeringTheCube + (cubeRow * cube.userData.size.y)

  let direction = -1
  if(cube.userData.team === 'right') direction = 1

  // set x and y targets
  let overRideY = rowRedirect * gapSize
  let overRideX = (((cube.userData.index % halfRowLength) * cube.userData.size.x) + 2) * (gapSize * direction)

  const yIncrement = (y * velocity)
  const xIncrement = (x * velocity)

  // iterate to x position
  if(cube.userData.team === 'right' && cube.position.x < overRideX) overRideX = cube.position.x + xIncrement
  else if(cube.userData.team === 'left' && cube.position.x > overRideX) overRideX = cube.position.x - xIncrement

  // iterate to y position
  if(cubeRow < halfRowLength && cube.position.y > overRideY) overRideY = cube.position.y - yIncrement
  else if(cubeRow >= halfRowLength && cube.position.y < overRideY) overRideY = cube.position.y + yIncrement

  return {
    x: overRideX || cube.position.x + xIncrement,
    y: overRideY || cube.position.y + yIncrement,
    z: cube.position.z + (z * velocity)
  }
}

export const positionChange = (cube, velocity, act) => {
  switch (act) {
    case 1: return actOne(cube, velocity)
    case 2: return actTwo(cube, velocity)
    default: return actOne(cube, velocity)
  }
}
