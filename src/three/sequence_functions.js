import {halfRowLength} from './modules'
// import * as d3 from 'd3'
// import {cubicOut, cubicIn,linear, cubicInOut, elasticInOut, quartInOut, quartIn, quartOut} from 'eases'
import _ from 'lodash'
import {iterateToTarget} from './sequence_modules'
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


// if(value && cube.userData.index === 0) {
//   console.log("cube",cube)
//   value = false
// }














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



let actThreeRandomCubes = new Array(10).fill(0).map((item, i) => {
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
      if(snake.length === 10) {
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

const addSnakeMovements = (x,y,z,position) => {
  snakeMovements.unshift({
    x,y,z,
    position:{ ...position},
    cubesPassedThru:[]
  })
}

const actThreePart2 = (cube, velocity, direction, dimensions) => {
  let x = 0
  let y = 0
  let z = 0

  let overRideX
  let overRideY

  let thisCube = snake.filter(item => item.snakeCube.team === cube.userData.team && item.snakeCube.value === cube.userData.index )

  if(!!thisCube.length){
    if(thisCube[0].snakeCube.snakeIndex === 0) {
      if(direction.twoD === 0 && headDirX !== 0 && headDirY !== 1) {
        headDirX = 0
        headDirY = 1
        addSnakeMovements(headDirX,headDirY,0,cube.position)
      } else if(direction.twoD === 1 && headDirX !== 1 && headDirY !== 0) {
        headDirX = 1
        headDirY = 0
        addSnakeMovements(headDirX,headDirY,0,cube.position)
      } else if(direction.twoD === 2 && headDirX !== 0 && headDirY !== -1) {
        headDirX = 0
        headDirY = -1
        addSnakeMovements(headDirX,headDirY,0,cube.position)
      } else if(direction.twoD === 3 && headDirX !== -1 && headDirY !== 0) {
        headDirX = -1
        headDirY = 0
        addSnakeMovements(headDirX,headDirY,0,cube.position)
      }
    }

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
const selectRandomCube = () => {
  return _.random(0,99)
}

const isIncluded = (snakey, randomCube) => {
  return !!snakey.filter(item => item.mesh.userData.uniqueIndex === randomCube).length
}

let growSnake = (cube) => {
  if(start) {
    console.log("snake",snake, cube.userData.uniqueIndex)
    snake.push({
      mesh:cube,
      snakeCube: {snakeIndex: snake.length }
    })
    setTimeout(() => addNewCube = true, 1000)
  }
  else clearSnake()
}

const actFour = (cube, velocity, direction, dimensions) => {
  let x = 0
  let y = 0
  let z = 0

  let overRideX
  let overRideY
  let thisCube = snake.filter(item => item.snakeCube.team === cube.userData.team && item.snakeCube.value === cube.userData.index )

  if(!!thisCube.length){
    if(thisCube[0].snakeCube.snakeIndex === 0) {
      if(direction.twoD === 0 && headDirX !== 0 && headDirY !== 1) {
        headDirX = 0
        headDirY = 1
        addSnakeMovements(headDirX,headDirY,0,cube.position)
      } else if(direction.twoD === 1 && headDirX !== 1 && headDirY !== 0) {
        headDirX = 1
        headDirY = 0
        addSnakeMovements(headDirX,headDirY,0,cube.position)
      } else if(direction.twoD === 2 && headDirX !== 0 && headDirY !== -1) {
        headDirX = 0
        headDirY = -1
        addSnakeMovements(headDirX,headDirY,0,cube.position)
      } else if(direction.twoD === 3 && headDirX !== -1 && headDirY !== 0) {
        headDirX = -1
        headDirY = 0
        addSnakeMovements(headDirX,headDirY,0,cube.position)
      }
    }

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
  } else {
    //// GROW SNAKE123 HERE

    
    // if(beginSnakeGrowth && cube.userData.index === 2) console.log("cube",cube)
    // cube.userData.
    // console.log("snake",snake)
    // animate the snake growth here

    // first, define targetsxs

    // iteratre to them
    // const tgs = iterateToTarget(cube, xTarget, yTarget, xPrior, yPrior, xDirection, yDirection, x, y, speedup)
    // overRideX = tgs.overRideX
    // overRideY = tgs.overRideY

    // let thisCube = actThreeRandomCubes.filter(item => item.team === cube.userData.team && item.value === cube.userData.index)
    //
    // if(thisCube.length === 1) { // create snake
    //   if(snake.length !== actThreeRandomCubes.length) {
    //     snake.push({ mesh:cube, snakeCube:thisCube[0] })
    //   }
    // }
  }

  // redirect snake position when it hits the edge of the view
  let newX = overRideX || cube.position.x + (x * velocity * 0.1)
  let newY = overRideY || cube.position.y + (y * velocity * 0.1)

  if(Math.abs(newX) >= Math.floor(dimensions.width / 2))  newX = newX * -1
  if(Math.abs(newY) >= Math.floor(dimensions.height / 2)) newY = newY * -1

  if(addNewCube && findCubeLoopBoolean) {
    /// this fires only when a new cube is to be added AND a cube needs to found
    selectedCubeIndex = findCubeLoop(snake)
  }

  // console.log("addNewCube",addNewCube, selectedCubeIndex)

  if(addNewCube && selectedCubeIndex === cube.userData.uniqueIndex) {
    addNewCube = false         // this cube has been added, so wait for growSnake to allow another to be added
    findCubeLoopBoolean = true // find a new cube to add next time
    growSnake(cube)
  }



  return {
    x: newX,
    y: newY,
    z: cube.position.z + (z * velocity * 0.1)
  }
}


function findCubeLoop(snakey) {

  let loopBoolean = true
  let internalCubeIndex = 0

  while (loopBoolean) {
    const randomCube = selectRandomCube()
    const isCubeInSnake = isIncluded(snakey, randomCube)
    if (!isCubeInSnake) {                 // when not included
      internalCubeIndex = randomCube      // set index to random cube value
      loopBoolean = false                   // break loop

      findCubeLoopBoolean = false // dont find another cube for now
    }
  }

  return internalCubeIndex
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
