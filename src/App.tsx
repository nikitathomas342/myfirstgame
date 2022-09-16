/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface GameStates {
  scores?: {
    playerOne?: number
    playerTwo?: number
  }
  isGameStarted?: boolean
  ball?: {
    x?: number
    y?: number
    vx?: number
    vy?: number
  }
}

const defaultGameStates: GameStates = {
  scores: {
    playerOne: 0,
    playerTwo: 0,
  },
  isGameStarted: false,
  ball: {
    vx: 0,
    vy: 0,
  },
}

const gameStates: GameStates = {}

const initializeStates = () => Object.assign(gameStates, defaultGameStates)

const renderBackground = (
  { width, height }: { width: number; height: number },
  ctx: CanvasRenderingContext2D,
) => ctx.fillRect(0, 0, width, height)

const refreshFrames = ({ width, height }: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = 'black'
  renderBackground({ width, height }, ctx)
}

const renderBall = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const { x, y, vx, vy } = gameStates.ball!
  const newX = x! + vx!
  const newY = y! + vy!
  if (gameStates.isGameStarted) refreshFrames(canvas, ctx)
  ctx.beginPath()
  ctx.arc(newX!, newY!, 1, 0, 2 * Math.PI)
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.closePath()
  Object.assign(gameStates.ball!, { x: newX, y: newY })
}

const reloadActivities = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const { isGameStarted } = gameStates
  if (isGameStarted) {
    renderBall(canvas, ctx)
    const { x, y } = gameStates.ball!
    if (x! < 0) gameStates.ball!.vx = -gameStates.ball!.vx!
    if (x! > canvas.width) gameStates.ball!.vx = -gameStates.ball!.vx!
    if (y! < 0) gameStates.ball!.vy = -gameStates.ball!.vy!
    if (y! > canvas.height) gameStates.ball!.vy = -gameStates.ball!.vy!
  }
}

const activateFrameRate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) =>
  setInterval(() => reloadActivities(canvas, ctx), 1000 / 60)

const onload = () => {
  initializeStates()
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  // set starting ball point
  const [x, y] = [canvas.width, canvas.height].map((c) => c / 2)
  Object.assign(gameStates.ball!, { x, y })
  renderBackground(canvas, ctx)
  renderBall(canvas, ctx)
  activateFrameRate(canvas, ctx)
}

Object.assign(window, { onload })

// start game
window.addEventListener('click', () => {
  if (!gameStates.isGameStarted) {
    const randomDirection = (): number => {
      const randomValue = Math.floor(Math.random() * 2.5 - 1.25)
      if (randomValue === 0) return randomDirection()
      return randomValue
    }
    const vx = randomDirection()
    const vy = randomDirection()
    Object.assign(gameStates.ball!, { vx, vy })
    gameStates.isGameStarted = true
  }
})

export const App = () => (
  <canvas id='gameCanvas' style={{ width: '100vw', height: '100vh' }}></canvas>
)
