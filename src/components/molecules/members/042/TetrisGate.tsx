'use client'

/* eslint-disable react-hooks/exhaustive-deps -- The game loop intentionally reads from a stable mutable state ref. */

import { useEffect, useRef, useCallback, useState } from 'react'

const COLS = 10
const ROWS = 20
const SZ = 28
const TARGET_LINES = 4

const COLORS = ['#534AB7', '#1D9E75', '#E24B4A', '#EF9F27', '#378ADD', '#D4537E', '#5DCAA5']

const SHAPES = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 0, 0],
    [1, 1, 1]
  ],
  [
    [0, 0, 1],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ]
]

type Board = (string | 0)[][]
type Piece = { shape: number[][]; color: string; x: number; y: number }

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0))
}

function randPiece(): Piece {
  const i = Math.floor(Math.random() * SHAPES.length)
  const shape = SHAPES[i].map((r) => [...r])
  return {
    shape,
    color: COLORS[i],
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0
  }
}

interface TetrisGateProps {
  onSuccess: () => void
}

export default function TetrisGate({ onSuccess }: TetrisGateProps) {
  const boardRef = useRef<HTMLCanvasElement>(null)
  const nextRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    board: emptyBoard() as Board,
    piece: randPiece(),
    nextPiece: randPiece(),
    score: 0,
    linesCleared: 0,
    running: false,
    paused: false,
    lastDrop: 0,
    animId: 0
  })

  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)

  const s = stateRef.current

  const validPos = useCallback((p: Piece, dx = 0, dy = 0, shape?: number[][]) => {
    const sh = shape ?? p.shape
    for (let r = 0; r < sh.length; r++) {
      for (let c = 0; c < sh[r].length; c++) {
        if (!sh[r][c]) continue
        const nx = p.x + c + dx
        const ny = p.y + r + dy
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false
        if (ny >= 0 && s.board[ny][nx]) return false
      }
    }
    return true
  }, [])

  const drawBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.fillStyle = color
    ctx.fillRect(x * SZ + 1, y * SZ + 1, SZ - 2, SZ - 2)
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.fillRect(x * SZ + 1, y * SZ + 1, SZ - 2, 3)
  }

  const drawNext = useCallback(() => {
    const nc = nextRef.current
    if (!nc) return
    const nctx = nc.getContext('2d')!
    nctx.fillStyle = '#0d1117'
    nctx.fillRect(0, 0, 80, 80)
    const ns = 16
    const { shape, color } = s.nextPiece
    const ox = Math.floor((80 - shape[0].length * ns) / 2)
    const oy = Math.floor((80 - shape.length * ns) / 2)
    shape.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v) {
          nctx.fillStyle = color
          nctx.fillRect(ox + c * ns + 1, oy + r * ns + 1, ns - 2, ns - 2)
        }
      })
    )
  }, [])

  const draw = useCallback(() => {
    const canvas = boardRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0d1117'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 0.5
    for (let r = 0; r < ROWS; r++) {
      ctx.beginPath()
      ctx.moveTo(0, r * SZ)
      ctx.lineTo(COLS * SZ, r * SZ)
      ctx.stroke()
    }
    for (let c = 0; c < COLS; c++) {
      ctx.beginPath()
      ctx.moveTo(c * SZ, 0)
      ctx.lineTo(c * SZ, ROWS * SZ)
      ctx.stroke()
    }

    // ghost
    let gy = s.piece.y
    while (validPos({ ...s.piece, y: gy + 1 })) gy++
    s.piece.shape.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v && gy + r >= 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.07)'
          ctx.fillRect((s.piece.x + c) * SZ + 1, (gy + r) * SZ + 1, SZ - 2, SZ - 2)
        }
      })
    )

    // board
    s.board.forEach((row, r) =>
      row.forEach((col, c) => {
        if (col) drawBlock(ctx, c, r, col as string)
      })
    )

    // active piece
    s.piece.shape.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v) drawBlock(ctx, s.piece.x + c, s.piece.y + r, s.piece.color)
      })
    )

    drawNext()
  }, [validPos, drawNext])

  const clearLines = useCallback(() => {
    let cleared = 0
    for (let r = ROWS - 1; r >= 0; r--) {
      if (s.board[r].every((c) => c)) {
        s.board.splice(r, 1)
        s.board.unshift(Array(COLS).fill(0))
        cleared++
        r++
      }
    }
    if (cleared) {
      s.score += cleared * 100 * cleared
      s.linesCleared += cleared
      setScore(s.score)
      setLines(s.linesCleared)
      if (s.linesCleared >= TARGET_LINES) {
        s.running = false
        setWon(true)
      }
    }
  }, [])

  const lockPiece = useCallback(() => {
    s.piece.shape.forEach((row, ri) =>
      row.forEach((v, ci) => {
        if (v && s.piece.y + ri >= 0) s.board[s.piece.y + ri][s.piece.x + ci] = s.piece.color
      })
    )
    clearLines()
    s.piece = s.nextPiece
    s.nextPiece = randPiece()
    if (!validPos(s.piece)) {
      s.running = false
      setGameOver(true)
    }
  }, [clearLines, validPos])

  const loop = useCallback(
    function gameLoop(ts: number = 0) {
      if (!s.running || s.paused) return
      const speed = Math.max(100, 500 - s.linesCleared * 30)
      if (ts - s.lastDrop > speed) {
        if (!validPos(s.piece, 0, 1)) lockPiece()
        else s.piece.y++
        s.lastDrop = ts
      }
      draw()
      s.animId = requestAnimationFrame(gameLoop)
    },
    [draw, lockPiece, validPos]
  )

  const hardDrop = useCallback(() => {
    if (!s.running || s.paused) return
    while (validPos(s.piece, 0, 1)) s.piece.y++
    lockPiece()
    draw()
  }, [validPos, lockPiece, draw])

  const rotatePiece = useCallback(() => {
    if (!s.running || s.paused) return
    const rot = s.piece.shape[0].map((_, i) => s.piece.shape.map((r) => r[i]).reverse())
    if (validPos(s.piece, 0, 0, rot)) s.piece.shape = rot
    else if (validPos(s.piece, 1, 0, rot)) {
      s.piece.x++
      s.piece.shape = rot
    } else if (validPos(s.piece, -1, 0, rot)) {
      s.piece.x--
      s.piece.shape = rot
    }
  }, [validPos])

  const startGame = useCallback(() => {
    s.board = emptyBoard()
    s.piece = randPiece()
    s.nextPiece = randPiece()
    s.score = 0
    s.linesCleared = 0
    s.running = true
    s.paused = false
    s.lastDrop = performance.now()
    setScore(0)
    setLines(0)
    setGameOver(false)
    setWon(false)
    setPaused(false)
    setStarted(true)
    cancelAnimationFrame(s.animId)
    requestAnimationFrame(loop)
  }, [loop])

  const togglePause = useCallback(() => {
    s.paused = !s.paused
    setPaused(s.paused)
    if (!s.paused) {
      s.lastDrop = performance.now()
      requestAnimationFrame(loop)
    }
  }, [loop])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!s.running || s.paused) return
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'].includes(e.code)) e.preventDefault()
      if (e.code === 'ArrowLeft' && validPos(s.piece, -1, 0)) s.piece.x--
      else if (e.code === 'ArrowRight' && validPos(s.piece, 1, 0)) s.piece.x++
      else if (e.code === 'ArrowDown') {
        if (validPos(s.piece, 0, 1)) {
          s.piece.y++
          s.lastDrop = performance.now()
        }
      } else if (e.code === 'ArrowUp') rotatePiece()
      else if (e.code === 'Space') hardDrop()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [validPos, rotatePiece, hardDrop])

  useEffect(() => {
    draw()
  }, [draw])

  const progress = Math.min((lines / TARGET_LINES) * 100, 100)

  return (
    <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center gap-5 bg-[#0d1117] px-4 text-white">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Selesaikan {TARGET_LINES} baris untuk masuk</h1>
        <p className="mt-1 text-sm text-white/50">← → gerak · ↑ rotate · ↓ soft drop · Space hard drop</p>
      </div>

      <div className="flex items-start gap-5">
        {/* Board */}
        <div className="relative">
          <canvas ref={boardRef} width={COLS * SZ} height={ROWS * SZ} className="rounded-xl border border-white/10" />

          {/* Win overlay */}
          {won && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-black/85 p-6 text-center">
              <p className="text-2xl font-semibold">Kamu berhasil!</p>
              <p className="text-sm text-white/60">4 baris clear. Selamat datang di web angkatan!</p>
              <button
                onClick={onSuccess}
                className="mt-2 rounded-full bg-[#534AB7] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3C3489]"
              >
                Masuk ke halaman
              </button>
            </div>
          )}

          {/* Game over overlay */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-black/85 p-6 text-center">
              <p className="text-2xl font-semibold text-red-400">Game over</p>
              <p className="text-sm text-white/60">Coba lagi dan selesaikan {TARGET_LINES} baris!</p>
              <button
                onClick={startGame}
                className="mt-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Main lagi
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex w-28 flex-col gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-1 text-[10px] tracking-widest text-white/40 uppercase">Score</p>
            <p className="text-xl font-medium">{score}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-[10px] tracking-widest text-white/40 uppercase">Next</p>
            <canvas ref={nextRef} width={80} height={80} className="mx-auto" />
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-[10px] tracking-widest text-white/40 uppercase">Baris clear</p>
            <div className="h-2 overflow-hidden rounded bg-white/10">
              <div className="h-2 rounded bg-[#534AB7] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-center text-xs text-white/50">
              {Math.min(lines, TARGET_LINES)} / {TARGET_LINES}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {!started && (
          <button
            onClick={startGame}
            className="rounded-full border border-white/20 px-5 py-2 text-sm transition-colors hover:bg-white/10"
          >
            Mulai
          </button>
        )}
        {started && (
          <>
            <button
              onClick={togglePause}
              className="rounded-full border border-white/20 px-5 py-2 text-sm transition-colors hover:bg-white/10"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={startGame}
              className="rounded-full border border-white/20 px-5 py-2 text-sm transition-colors hover:bg-white/10"
            >
              Restart
            </button>
          </>
        )}
      </div>

      {/* Mobile controls */}
      {started && (
        <div className="flex flex-col items-center gap-2 sm:hidden">
          <button onClick={rotatePiece} className="h-12 w-12 rounded-xl border border-white/10 bg-white/10 text-lg">
            ↻
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (validPos(s.piece, -1, 0)) s.piece.x--
              }}
              className="h-12 w-12 rounded-xl border border-white/10 bg-white/10 text-lg"
            >
              ←
            </button>
            <button
              onClick={() => {
                if (validPos(s.piece, 0, 1)) {
                  s.piece.y++
                  s.lastDrop = performance.now()
                }
              }}
              className="h-12 w-12 rounded-xl border border-white/10 bg-white/10 text-lg"
            >
              ↓
            </button>
            <button
              onClick={() => {
                if (validPos(s.piece, 1, 0)) s.piece.x++
              }}
              className="h-12 w-12 rounded-xl border border-white/10 bg-white/10 text-lg"
            >
              →
            </button>
          </div>
          <button onClick={hardDrop} className="h-10 w-32 rounded-xl border border-white/10 bg-white/10 text-sm">
            Hard drop
          </button>
        </div>
      )}
    </div>
  )
}
