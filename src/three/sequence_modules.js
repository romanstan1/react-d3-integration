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
