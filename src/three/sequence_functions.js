import {halfRowLength} from './modules'
import * as d3 from 'd3'
import {cubicOut, cubicIn,linear, cubicInOut, elasticInOut, quartInOut, quartIn, quartOut} from 'eases'
import _ from 'lodash'

let value = 0
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

  return {
    x: overRideX,
    y: overRideY,
    z: cube.position.z + (z * velocity)
  }
}



const actThreeRandomCubes = new Array(10).fill(0).map((item, i) => {
  return { value: (i + 1) * (halfRowLength - 1) , team:  i%2 === 0? 'left' : 'right', snakeIndex: i}})
let snake = []
let switchActThree = true

const actThree = (cube, velocity, direction) => {
  if(switchActThree) {
    let y = 1
    let x = 1
    let z = 0
    const gapSize = 8
    let speedup = 10

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
    let xTarget =  xPrior * gapSize
    let yTarget = (cube.userData.centralProximity - (yDirection * 0.5)) * cube.userData.size.y * gapSize
    xPrior = xTarget
    yPrior = yTarget

    let thisCube = actThreeRandomCubes.filter(item => item.team === cube.userData.team && item.value === cube.userData.index)

    if(thisCube.length === 1) { // create snake
      if(snake.length !== actThreeRandomCubes.length) {
        snake.push({ mesh:cube, snakeCube:thisCube[0] })
      }
    }


    if(thisCube.length === 1) { // set snake cubes targets here
      if(snake.length === 10) {
        xTarget = thisCube[0].snakeIndex * cube.userData.size.x * -1
        yTarget = 0
        speedup = 0
        setTimeout(()=> switchActThree = false, 3000)
      }
      //snake cubes direction goes here
    } else {
      // set all other cubes targets here
      yTarget = yTarget + (yDirection * 1000)
    }
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

    if(xTarget > cube.position.x + newXIncrement + speedup) overRideX = cube.position.x + newXIncrement + speedup
    else if (xTarget < cube.position.x - newXIncrement - speedup) overRideX = cube.position.x - newXIncrement - speedup

    if(yTarget > cube.position.y + newYIncrement + speedup) overRideY = cube.position.y + newYIncrement + speedup
    else if (yTarget < cube.position.y - newYIncrement - speedup) overRideY = cube.position.y - newYIncrement - speedup

    return {
      x: overRideX,
      y: overRideY,
      z: cube.position.z + (z * velocity)
    }
  } else {
    return actThreePart2(cube, velocity, direction)
  }
}






let snakeMovements = []

const addSnakeMovements = (x,y,z,position) => {
  snakeMovements.unshift({
    x,y,z,
    position:{...position},
    cubesPassedThru:[]
  })
}

let overRideHeadX
let overRideHeadY
let overRideHeadZ

const actThreePart2 = (cube, velocity, direction) => {
  let x = 0
  let y = 0
  let z = 0

  let overRideX
  let overRideY

  // const snakePosition

  let thisCube = actThreeRandomCubes.filter(item => item.team === cube.userData.team && item.value === cube.userData.index)
  if(!!thisCube.length){
    if(thisCube[0].snakeIndex === 0) {
      // head of snake, directed by user input

      if(direction.twoD === 0 && overRideHeadX !== 0 && overRideHeadY !== 1) {
        overRideHeadX = 0
        overRideHeadY = 1
        addSnakeMovements(overRideHeadX,overRideHeadY,0,cube.position)
      } else if(direction.twoD === 1 && overRideHeadX !== 1 && overRideHeadY !== 0) {
        overRideHeadX = 1
        overRideHeadY = 0
        addSnakeMovements(overRideHeadX,overRideHeadY,0,cube.position)
      } else if(direction.twoD === 2 && overRideHeadX !== 0 && overRideHeadY !== -1) {
        overRideHeadX = 0
        overRideHeadY = -1
        addSnakeMovements(overRideHeadX,overRideHeadY,0,cube.position)
      } else if(direction.twoD === 3 && overRideHeadX !== -1 && overRideHeadY !== 0) {
        overRideHeadX = -1
        overRideHeadY = 0
        addSnakeMovements(overRideHeadX,overRideHeadY,0,cube.position)
      }

      x = overRideHeadX
      y = overRideHeadY
      // z = overRideHeadX

    } else {

      // body of snake

      const thisSnakeCube = snake.filter(item => item.snakeCube.snakeIndex === thisCube[0].snakeIndex)[0]
      // the snake cube in question, could be in any order


      // snake cube hits a position in the snake movements array and updates it personal direction
      // and it locks into a fixed override in all other direction
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
          // overRideX = snakeMovements[whichMovement].position.x

          thisSnakeCube.mesh.userData.direction.x = snakeMovements[whichMovement].x
          thisSnakeCube.mesh.userData.direction.y = snakeMovements[whichMovement].y
          x = snakeMovements[whichMovement].x
          // logs the cube's snakeindex into snakeMovements array// only once!
          if(!snakeMovements[whichMovement].cubesPassedThru.includes(thisSnakeCube.snakeCube.snakeIndex)) {
            snakeMovements[whichMovement].cubesPassedThru.push(thisSnakeCube.snakeCube.snakeIndex)
          }
        }


      } else if (thisSnakeCube.mesh.userData.direction.x < 0) {   // for a snakecube going negatively in the x Direction

        // if the snakecube has not hit its target, iterate towards it
        if(thisSnakeCube.mesh.position.x > snakeMovements[whichMovement].position.x) {
          x = thisSnakeCube.mesh.userData.direction.x // maybe should be the previous movements direction
        } else {
          // hit its x target
          // overRideX = snakeMovements[whichMovement].position.x
          thisSnakeCube.mesh.userData.direction.x = snakeMovements[whichMovement].x
          thisSnakeCube.mesh.userData.direction.y = snakeMovements[whichMovement].y
          x = snakeMovements[whichMovement].x

          // logs the cube's snakeindex into snakeMovements array// only once!
          if(!snakeMovements[whichMovement].cubesPassedThru.includes(thisSnakeCube.snakeCube.snakeIndex)) {
            snakeMovements[whichMovement].cubesPassedThru.push(thisSnakeCube.snakeCube.snakeIndex)
          }
        }


      } else { // for a snakecube that is not moving in the x plane at all
        x = 0
      }


      // for a snakecube going positively in the y Direction x --------------------------------------------------------
      if(thisSnakeCube.mesh.userData.direction.y > 0) {
        // if the snakecube has not hit its target, iterate towards it
        if(thisSnakeCube.mesh.position.y < snakeMovements[whichMovement].position.y) {
          y = thisSnakeCube.mesh.userData.direction.y // maybe should be the previous movements direction
        } else {
          // hit its y target
          // overRideY = snakeMovements[whichMovement].position.y
          thisSnakeCube.mesh.userData.direction.x = snakeMovements[whichMovement].x
          thisSnakeCube.mesh.userData.direction.y = snakeMovements[whichMovement].y
          y = snakeMovements[whichMovement].y
          // logs the cube's snakeindex into snakeMovements array// only once!
          if(!snakeMovements[whichMovement].cubesPassedThru.includes(thisSnakeCube.snakeCube.snakeIndex)) {
            snakeMovements[whichMovement].cubesPassedThru.push(thisSnakeCube.snakeCube.snakeIndex)
          }
        }


      } else if (thisSnakeCube.mesh.userData.direction.y < 0) {   // for a snakecube going negatively in the x Direction
        // if the snakecube has not hit its target, iterate towards it
        if(thisSnakeCube.mesh.position.y > snakeMovements[whichMovement].position.y) {
          y = thisSnakeCube.mesh.userData.direction.y // maybe should be the previous movements direction
        } else {
          // hit its x target
          // overRideX = snakeMovements[whichMovement].position.x
          thisSnakeCube.mesh.userData.direction.x = snakeMovements[whichMovement].x
          thisSnakeCube.mesh.userData.direction.y = snakeMovements[whichMovement].y
          y = snakeMovements[whichMovement].y
          // logs the cube's snakeindex into snakeMovements array// only once!
          if(!snakeMovements[whichMovement].cubesPassedThru.includes(thisSnakeCube.snakeCube.snakeIndex)) {
            snakeMovements[whichMovement].cubesPassedThru.push(thisSnakeCube.snakeCube.snakeIndex)
          }
        }


      } else { // for a snakecube that is not moving in the x plane at all
        y = 0
      }




      //
      // if(value2) {
      //
      //   console.log("thisSnakeCube",thisSnakeCube)
      //   console.log("snakeMovements", snakeMovements)
      //   console.log("thisSnakeCube.mesh.userData.direction", thisSnakeCube.mesh.userData.direction)
      //   value2 = false
      // }


      // normal movement is in the direction it was previously going, which is defined on each cube.

      // y = thisSnakeCube.mesh.userData.direction.y

      // if(thisSnakeCube.mesh.userData.direction.x !== 0) {
      //
      //   if(thisSnakeCube.mesh.position.x > snakeMovements[0].position.x) {
      //     thisSnakeCube.mesh.userData.direction.x = snakeMovements[0].x
      //     console.log("overRideX",x, overRideX)
      //     overRideX = snakeMovements[0].position.x
      //   } else {
      //     x = thisSnakeCube.mesh.userData.direction.x
      //     console.log("x",x)
      //   }
      //
      //   if(thisSnakeCube.mesh.position.y > snakeMovements[0].position.y) {
      //     thisSnakeCube.mesh.userData.direction.y = snakeMovements[0].y
      //     overRideY = snakeMovements[0].position.y
      //   } else {
      //     y = thisSnakeCube.mesh.userData.direction.y
      //   }
      //
      //
      // }




      // body of snake to follow the previous snake movements
      // if(!!snakeMovements && snakeMovements.length > 1
      //   && snakeMovements[snakeMovements.length - 2].position.x > cube.position.x
      //   && thisCube[0].snakeIndex === 1
      // ) {
      //
      //   // x = snakeMovements[snakeMovements.length - 2].x
      //   y = snakeMovements[snakeMovements.length - 2].y
      //
      //   overRideX = snakeMovements[snakeMovements.length - 2].position.x
      //
      //   console.log("snakeMovements inside",snakeMovements, thisCube)
      //
      //
      // } else {
      //   x = overRideHeadX
      //   y = overRideHeadY
      // }



      // if(value2) {
      //
      //   console.log("thisSnakeCube",thisSnakeCube)
      //   console.log("snakeMovements", snakeMovements)
      //   value2 = false
      // }



    }
  }

  return {
    x: overRideX || cube.position.x + (x * velocity * 0.1),
    y: overRideY || cube.position.y + (y * velocity * 0.1),
    z: cube.position.z + (z * velocity * 0.1)
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

export const positionChange = (cube, controls, act) => {
  switch (act) {
    case 1: return actOne(cube, controls.animationSpeed)
    case 2: return actTwo(cube, controls.animationSpeed)
    case 3: return actThree(cube, controls.animationSpeed, controls.direction)
    default: return actRandom(cube, controls.animationSpeed)
  }
}
