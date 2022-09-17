/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GameStates } from './types'

const defaultGameStates: GameStates = {
  isGameStarted: false,
  ball: {
    vx: 0,
    vy: 0,
    collided: false,
  },
  controller: {
    x: window.innerWidth / 2,
  },
}

const gameStates: GameStates = {}

const initializeStates = () => Object.assign(gameStates, defaultGameStates)

const controllerWidth = 50
const controllerHeight = 10
const controllerOffSet = 2

const ballSize = 1.5

const obstacleWidth = 10
const obstacleHeight = 3

// background render functions
const renderBackground = (
  { width, height }: { width: number; height: number },
  ctx: CanvasRenderingContext2D,
) => ctx.fillRect(0, 0, width, height)

// ball render functions
const renderBall = (ctx: CanvasRenderingContext2D) => {
  const { x, y, vx, vy } = gameStates.ball!
  const newX = x! + vx!
  const newY = y! + vy!
  ctx.beginPath()
  ctx.arc(newX!, newY!, ballSize, 0, 2 * Math.PI)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.closePath()
  Object.assign(gameStates.ball!, { x: newX, y: newY })
}

const detectCollisionBetweenControllerAndBall = (canvas: HTMLCanvasElement): boolean => {
  if (!gameStates.ball?.collided) {
    const controllerPositionX = getControllerPosition(canvas)
    const rangeNegative = controllerPositionX - controllerWidth / 2
    const rangePositive = controllerPositionX + controllerWidth / 2
    const controllerPositionY = canvas.height - controllerOffSet
    const { x, y } = gameStates.ball!
    const isXOverlap = rangeNegative <= x! && x! <= rangePositive
    const isYOverlap = y! > controllerPositionY - 1.75
    return isXOverlap && isYOverlap
  }
  return false
}

const invertVector = (direction: 'vy' | 'vx') =>
  (gameStates.ball![direction] = -gameStates.ball![direction]!)

const handleControllerCollision = () => {
  invertVector('vy')
  gameStates.ball!.collided = true
  setTimeout(() => (gameStates.ball!.collided = false), gameStates.ball!.vy! * 1000)
}

const reloadBall = (canvas: HTMLCanvasElement) => {
  const { isGameStarted } = gameStates
  if (isGameStarted) {
    const { x, y } = gameStates.ball!
    const collision = detectCollisionBetweenControllerAndBall(canvas)
    if (collision) handleControllerCollision()
    if (x! < 0 + ballSize || x! > canvas.width - ballSize) invertVector('vx')
    if (y! < 0 + ballSize) invertVector('vy')
    if (y! > canvas.height - ballSize) {
      gameStates.isGameStarted = false
      Object.assign(gameStates.ball!, { vx: 0, vy: 0 })
      onload()
    }
  }
}

// controller render functions
const getControllerPosition = (canvas: HTMLCanvasElement): number => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  return (gameStates.controller!.x! - rect.left) * scaleX - controllerWidth / 2
}

const renderController = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  ctx.beginPath()
  ctx.rect(
    getControllerPosition(canvas),
    canvas.height - controllerOffSet,
    controllerWidth,
    controllerHeight,
  )
  ctx.fillStyle = '#E5DCDC'
  ctx.fill()
  ctx.closePath()
}

const refreshFrames = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = 'black'
  renderBackground(canvas, ctx)
  reloadBall(canvas)
  renderBall(ctx)
  renderController(canvas, ctx)
}

const activateFrameRate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) =>
  setInterval(() => refreshFrames(canvas, ctx), 1000 / 200)

const onload = () => {
  initializeStates()
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const [x, y] = [canvas.width, canvas.height].map((c) => c / 2)
  Object.assign(gameStates.ball!, { x, y })
  activateFrameRate(canvas, ctx)
  window.addEventListener('mousemove', ({ clientX }) => (gameStates.controller!.x = clientX))
}

const onclick = () => {
  if (!gameStates.isGameStarted) {
    const directionX = Math.round(Math.random())
    const directionY = Math.round(Math.random())
    const level = 1
    let vx = level * Math.random()
    let vy = level * Math.random()
    if (directionX === 0) vx = -vx
    if (directionY === 0) vy = -vy
    Object.assign(gameStates.ball!, { vx, vy })
    gameStates.isGameStarted = true
  }
}

Object.assign(window, { onload, onclick, onmousemove })

export const App = () => <canvas id='gameCanvas' style={{ width: '100vw', height: '100vh' }} />
