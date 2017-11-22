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

const actTwo = (cube, velocity) => {
  let y = 0
  let x = 0
  let z = 0
  let overRideX
  let overRideY

  return {
    x: overRideX || cube.position.x + (x * velocity),
    y: overRideY || cube.position.y + (y * velocity),
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
