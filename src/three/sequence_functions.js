import {halfRowLength} from './modules'
// import * as d3 from 'd3'
// import {cubicOut, cubicIn,linear, cubicInOut, elasticInOut, quartInOut, quartIn, quartOut} from 'eases'
import _ from 'lodash'
import {iterateToTarget, iterateToTargetLinear, animateSnakeBody,snakeHeadDirection, findCubeLoop} from './sequence_modules'
import {start} from './dot_animation_three'

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




const actTwo = (cube, velocity) => {
  let y = 1
  let x = 1
  let z = 0
  const gapSize = 8
  const speedup = 0

  let xDirection = -1
    if(cube.userData.team === 'right') xDirection = 1

  const yDirection = cube.userData.centralProximity / Math.abs(cube.userData.centralProximity)

// establish prior positions for x and y
  const centeringTheCube = (halfRowLength * cube.userData.size.y) - 2
  const rowRedirect = (cube.userData.rowIndex * cube.userData.size.y) - centeringTheCube

  // let yPrior = cube.userData.centralProximity + (cube.userData.rowIndex * cube.userData.size.y)
  let yPrior = rowRedirect * -1
  let xPrior = (cube.userData.index % halfRowLength) * cube.userData.size.x
    if(cube.userData.team === 'right' ) xPrior = xPrior + 2
    else xPrior = (xPrior * xDirection) - 2

// targets for x and y
  const xTarget =  xPrior * gapSize
  const yTarget = (cube.userData.centralProximity - (yDirection * 0.5)) * cube.userData.size.y * gapSize

// ease and increment to positions
  const tgs = iterateToTarget(cube, xTarget, yTarget, xPrior, yPrior, xDirection, yDirection, x, y, speedup)

  return {
    x: tgs.overRideX,
    y: tgs.overRideY,
    z: cube.position.z + (z * velocity)
  }
}


let snakeSize = 10
let actThreeRandomCubes = new Array(snakeSize).fill(0).map((item, i) => {
  return { value: (i + 1) * (halfRowLength - 1) , team:  i%2 === 0? 'left' : 'right', snakeIndex: i}})

let snake = []
let switchActThree = true

const actThree = (cube, velocity, direction, dimensions) => {
  if(switchActThree) {
    let y = 1
    let x = 1
    let z = 0
    const gapSize = 8
    let speedup = 10

    let xDirection = -1
    if(cube.userData.team === 'right') xDirection = 1

    const yDirection = cube.userData.centralProximity / Math.abs(cube.userData.centralProximity)

    // establish prior positions for x and y
    const centeringTheCube = (halfRowLength * cube.userData.size.y) - 2
    const rowRedirect = (cube.userData.rowIndex * cube.userData.size.y) - centeringTheCube

    // let yPrior = cube.userData.centralProximity + (cube.userData.rowIndex * cube.userData.size.y)
    let yPrior = rowRedirect * -1
    let xPrior = (cube.userData.index % halfRowLength) * cube.userData.size.x
    if(cube.userData.team === 'right' ) xPrior = xPrior + 2
    else xPrior = (xPrior * xDirection) - 2

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
      if(snake.length === snakeSize) {
        xTarget = thisCube[0].snakeIndex * cube.userData.size.x * -1
        yTarget = 0
        speedup = 0
        setTimeout(()=> switchActThree = false, 2000)
      }
      //snake cubes direction goes here
    } else {
      // set all other cubes targets here
      yTarget = yTarget + (yDirection * 1000)
    }

    // iterate and ease to a point
    const tgs = iterateToTarget(cube, xTarget, yTarget, xPrior, yPrior, xDirection, yDirection, x, y, speedup)

    return {
      x: tgs.overRideX,
      y: tgs.overRideY,
      z: cube.position.z + (z * velocity)
    }
  } else {
    return actThreePart2(cube, velocity, direction, dimensions)
  }
}


const clearSnake = () => {
  snake = []
  snakeMovements = []
  headDirX = null
  headDirY = null
  headDirZ = null
  addNewCube = true
  switchActThree = true
}

var snakeMovements = []
var headDirX
var headDirY
var headDirZ
var addNewCube = true

const actThreePart2 = (cube, velocity, direction, dimensions) => {
  let x = 0
  let y = 0
  let z = 0

  let overRideX
  let overRideY

  let thisCube = snake.filter(item => item.mesh.userData.uniqueIndex === cube.userData.uniqueIndex)

  if(!!thisCube.length && thisCube[0].mesh.userData.original === true){
    const drc = snakeHeadDirection(thisCube,headDirX,headDirY,direction,cube,snakeMovements)
    headDirX = drc.headDirX; headDirY = drc.headDirY;
    const snk = animateSnakeBody(thisCube, overRideX, overRideY, x, y, snakeMovements)
    y = snk.y; x = snk.x; overRideX = snk.overRideX; overRideY = snk.overRideY
  }

  // redirect snake position when it hits the edge of the view
  let newX = overRideX || cube.position.x + (x * velocity * 0.1)
  let newY = overRideY || cube.position.y + (y * velocity * 0.1)

  if(Math.abs(newX) >= Math.floor(dimensions.width / 2))  newX = newX * -1
  if(Math.abs(newY) >= Math.floor(dimensions.height / 2)) newY = newY * -1

  return {
    x: newX,
    y: newY,
    z: cube.position.z + (z * velocity * 0.1)
  }
}

var findCubeLoopBoolean = true
var selectedCubeIndex = 0

let growSnake = (cube) => {
  if(start) {
    console.log("snake",snake, cube.userData.uniqueIndex)
    cube.userData = {
      ...cube.userData,
      original:false,
      new: true
    }
    snake.push({
      mesh:cube,
      snakeCube: {snakeIndex: snake.length}
    })
    if(snake.length < 12) setTimeout(() => addNewCube = true, 10000)
  }
  else clearSnake()
}

const actFour = (cube, velocity, direction, dimensions) => {                                           /////////////  ACT 4
  let x = 0
  let y = 0
  let z = 0

  let overRideX
  let overRideY
  let reOverRideX
  let reOverRideY

  let thisCube = snake.filter(item => item.mesh.userData.uniqueIndex === cube.userData.uniqueIndex )

  if(!!thisCube.length && thisCube[0].mesh.userData.original === true){

    const drc = snakeHeadDirection(thisCube,headDirX,headDirY,direction,cube,snakeMovements)
    headDirX = drc.headDirX; headDirY = drc.headDirY;

    const snk = animateSnakeBody(thisCube, overRideX, overRideY, x, y, snakeMovements)
    y = snk.y; x = snk.x; overRideX = snk.overRideX; overRideY = snk.overRideY

  } else {
    //// GROW SNAKE HERE
    if(!!thisCube.length) {
      let endOfSnake = snake.filter(item => item.mesh.userData.original === true)
      endOfSnake = endOfSnake[endOfSnake.length - 1].mesh.position
      // last cube in stake body ie the tail
      const tgs = iterateToTargetLinear(cube, endOfSnake.x, endOfSnake.y, 5)

      if(tgs.hitX && tgs.hitY) {
         thisCube[0].mesh.userData.original = true
      } else {
        reOverRideX = tgs.overRideX
        reOverRideY = tgs.overRideY
      }

    }
  }

  // redirect snake position when it hits the edge of the view
  let newX = overRideX || cube.position.x + (x * velocity * 0.1)
  let newY = overRideY || cube.position.y + (y * velocity * 0.1)

  if(Math.abs(newX) >= Math.floor(dimensions.width / 2))  newX = newX * -1
  if(Math.abs(newY) >= Math.floor(dimensions.height / 2)) newY = newY * -1

  if(addNewCube && findCubeLoopBoolean) {
    /// this fires only when a new cube is to be added AND a cube needs to found
    selectedCubeIndex = findCubeLoop(snake)
    findCubeLoopBoolean = false
  }

  if(addNewCube && selectedCubeIndex === cube.userData.uniqueIndex) {
    addNewCube = false         // this cube has been added, so wait for growSnake to allow another to be added
    findCubeLoopBoolean = true // find a new cube to add next time
    growSnake(cube)
  }

  return {
    x: reOverRideX || newX,
    y: reOverRideY || newY,
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
    case 3: return actThree(cube, controls.animationSpeed, controls.direction, controls.dimensions)
    case 4: return actFour(cube, controls.animationSpeed, controls.direction, controls.dimensions)
    default: return actRandom(cube, controls.animationSpeed)
  }
}
