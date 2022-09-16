export interface GameStates {
  isGameStarted?: boolean
  ball?: {
    x?: number
    y?: number
    vx?: number
    vy?: number
    collided?: boolean
  }
  controller?: {
    x?: number
  }
}
