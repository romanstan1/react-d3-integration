import * as d3 from 'd3'
import {cubicOut} from 'eases'

export const iterateToTarget = (cube, xTarget, yTarget, xPrior, yPrior, xDirection, yDirection, x, y, speedup) => {

  const xScale = d3.scaleLinear().domain([xPrior, xTarget])
  const yScale = d3.scaleLinear().domain([yPrior, yTarget])

  const yAbs = cube.position.y + (y * yDirection)
  const yVal = yScale(yAbs)
  const yEased = cubicOut(yVal)
  const newYIncrement = (yEased/yVal)

  const xAbs = cube.position.x + (x * xDirection)
  const xVal = xScale(xAbs)
  const xEased = cubicOut(xVal)
  const newXIncrement = (xEased/xVal)

  let overRideX = xTarget
  let overRideY = yTarget

  if(xTarget > cube.position.x + newXIncrement + speedup) overRideX = cube.position.x + newXIncrement + speedup
  else if (xTarget < cube.position.x - newXIncrement - speedup) overRideX = cube.position.x - newXIncrement - speedup

  if(yTarget > cube.position.y + newYIncrement + speedup) overRideY = cube.position.y + newYIncrement + speedup
  else if (yTarget < cube.position.y - newYIncrement - speedup) overRideY = cube.position.y - newYIncrement - speedup


  return {
    overRideX,
    overRideY
  }
}

export const iterateToTargetLinear = (cube, xTarget, yTarget, speedup) => {

  const newIncrement = 0.1

  let overRideX = xTarget
  let overRideY = yTarget

  let hitX = false
  let hitY = false

  if(xTarget > cube.position.x + newIncrement + speedup) overRideX = cube.position.x + newIncrement + speedup
  else if (xTarget < cube.position.x - newIncrement - speedup) overRideX = cube.position.x - newIncrement - speedup
  else hitX = true

  if(yTarget > cube.position.y + newIncrement + speedup) overRideY = cube.position.y + newIncrement + speedup
  else if (yTarget < cube.position.y - newIncrement - speedup) overRideY = cube.position.y - newIncrement - speedup
  else hitY = true

  return {
    overRideX,
    overRideY,
    hitX,
    hitY
  }
}



export const animateSnakeBody = (thisCube) => {

  // body & head of snake
  const thisSnakeCube = thisCube[0]
  // the snake cube in question, could be in any order

  // snake cube hits a position in the snake movements array and updates it personal direction
  // and it locks into a fixed override in all other direction (update: no it doesnt)
  // and logs the snakeMovement that its follow internally, so future movements are executed, it does this only once.

  // establish which snake movement is next for this snake cube
  // returns (filters) the first item that does not have the SnakeIndex inside of it
  const whichMovement = snakeMovements.reduce((accumulator, item, i) => {
    if(item.cubesPassedThru.includes(thisSnakeCube.snakeCube.snakeIndex)) return accumulator
    else return i
  },0)

  // for a snakecube going positively in the x Direction
  if(thisSnakeCube.mesh.userData.direction.x > 0) {
    // console.log("thisSnakeCube",thisSnakeCube.mesh.userData.direction.x, snakeMovements[whichMovement].x)
    // if the snakecube has not hit its target, iterate towards it
    if(thisSnakeCube.mesh.position.x < snakeMovements[whichMovement].position.x) {
      x = thisSnakeCube.mesh.userData.direction.x // maybe should be the previous movements direction
    } else {
      // hit its x target
      thisSnakeCube.mesh.userData.direction.x = snakeMovements[whichMovement].x
      thisSnakeCube.mesh.userData.direction.y = snakeMovements[whichMovement].y
      x = snakeMovements[whichMovement].x
      // logs the cube's snakeindex into snakeMovements array// only once!
      if(!snakeMovements[whichMovement].cubesPassedThru.includes(thisSnakeCube.snakeCube.snakeIndex)) {
        overRideX = snakeMovements[whichMovement].position.x
        overRideY = snakeMovements[whichMovement].position.y
        snakeMovements[whichMovement].cubesPassedThru.push(thisSnakeCube.snakeCube.snakeIndex)
      }
    }
  } else if (thisSnakeCube.mesh.userData.direction.x < 0) {   // for a snakecube going negatively in the x Direction
    // if the snakecube has not hit its target, iterate towards it
    if(thisSnakeCube.mesh.position.x > snakeMovements[whichMovement].position.x) {
      x = thisSnakeCube.mesh.userData.direction.x // maybe should be the previous movements direction
    } else {
      // hit its x target
      thisSnakeCube.mesh.userData.direction.x = snakeMovements[whichMovement].x
      thisSnakeCube.mesh.userData.direction.y = snakeMovements[whichMovement].y
      x = snakeMovements[whichMovement].x
      // logs the cube's snakeindex into snakeMovements array// only once!
      if(!snakeMovements[whichMovement].cubesPassedThru.includes(thisSnakeCube.snakeCube.snakeIndex)) {
        overRideX = snakeMovements[whichMovement].position.x
        overRideY = snakeMovements[whichMovement].position.y
        snakeMovements[whichMovement].cubesPassedThru.push(thisSnakeCube.snakeCube.snakeIndex)
      }
    }
  } else { // for a snakecube that is not moving in the x plane at all
    x = 0
  }
  // for a snakecube going positively in the y Direction y --------------------------------------------------------
  if(thisSnakeCube.mesh.userData.direction.y > 0) {
    // if the snakecube has not hit its target, iterate towards it
    if(thisSnakeCube.mesh.position.y < snakeMovements[whichMovement].position.y) {
      y = thisSnakeCube.mesh.userData.direction.y // maybe should be the previous movements direction
    } else {
      // hit its y target or has hit it
      // overRideY = snakeMovements[whichMovement].position.y
      thisSnakeCube.mesh.userData.direction.y = snakeMovements[whichMovement].y
      thisSnakeCube.mesh.userData.direction.x = snakeMovements[whichMovement].x
      y = snakeMovements[whichMovement].y
      // logs the cube's snakeindex into snakeMovements array// only once!
      if(!snakeMovements[whichMovement].cubesPassedThru.includes(thisSnakeCube.snakeCube.snakeIndex)) {
        overRideX = snakeMovements[whichMovement].position.x
        overRideY = snakeMovements[whichMovement].position.y
        snakeMovements[whichMovement].cubesPassedThru.push(thisSnakeCube.snakeCube.snakeIndex)
      }
    }
  } else if (thisSnakeCube.mesh.userData.direction.y < 0) {   // for a snakecube going negatively in the y Direction
    // if the snakecube has not hit its target, iterate towards it
    if(thisSnakeCube.mesh.position.y > snakeMovements[whichMovement].position.y) {
      y = thisSnakeCube.mesh.userData.direction.y // maybe should be the previous movements direction
    } else {
      // hit its y target
      thisSnakeCube.mesh.userData.direction.y = snakeMovements[whichMovement].y
      thisSnakeCube.mesh.userData.direction.x = snakeMovements[whichMovement].x
      y = snakeMovements[whichMovement].y
      // logs the cube's snakeindex into snakeMovements array// only once!
      if(!snakeMovements[whichMovement].cubesPassedThru.includes(thisSnakeCube.snakeCube.snakeIndex)) {
        overRideY = snakeMovements[whichMovement].position.y
        overRideX = snakeMovements[whichMovement].position.x
        snakeMovements[whichMovement].cubesPassedThru.push(thisSnakeCube.snakeCube.snakeIndex)
      }
    }
  } else {
    y = 0 // for a snakecube that is not moving in the y plane at all
  }




}
