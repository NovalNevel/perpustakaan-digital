"use client";

import { cn } from "@/lib/utils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  colorMode?: "static" | "rainbow" | "fire" | "cyberpunk" | "matrix";
  hueShiftSpeed?: number;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 6,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 255, 255)", // Neon cyan
  className,
  maxOpacity = 0.5,
  colorMode = "static",
  hueShiftSpeed = 60,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [waveOffset, setWaveOffset] = useState(0);

  const waveSpeed = 200;
  const waveWidth = 120;

  const memoizedColor = useMemo(() => {
    if (typeof window === "undefined") return `rgba(0, 255, 255,`;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return `rgba(0, 255, 255,`;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
    return `rgba(${r}, ${g}, ${b},`;
  }, [color]);

  useEffect(() => {
    if (!containerRef.current) return;
    const resize = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      setCanvasSize({ width, height });
      setIsInView(true);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const setupCanvas = useCallback((canvas: HTMLCanvasElement, width: number, height: number) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cols = Math.floor(width / (squareSize + gridGap));
    const rows = Math.floor(height / (squareSize + gridGap));
    const squares = new Float32Array(cols * rows).map(() => Math.random() * maxOpacity);
    return { cols, rows, squares, dpr };
  }, [squareSize, gridGap, maxOpacity]);

  const updateSquares = useCallback((squares: Float32Array, deltaTime: number, cols: number, rows: number) => {
    const newOffset = (waveOffset + waveSpeed * deltaTime) % (canvasSize.width || 1);
    setWaveOffset(newOffset);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * (squareSize + gridGap);
        const index = i * rows + j;
        const distanceToWave = Math.abs(x - newOffset);
        let waveOpacity = 0;

        if (distanceToWave < waveWidth) {
          const t = distanceToWave / waveWidth;
          waveOpacity = maxOpacity * Math.exp(-t * 4);
        }

        if (Math.random() < flickerChance * deltaTime) {
          squares[index] = Math.random() * maxOpacity;
        }

        squares[index] = Math.max(squares[index], waveOpacity);
      }
    }
  }, [flickerChance, maxOpacity, squareSize, gridGap, waveOffset, canvasSize.width]);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, cols: number, rows: number, squares: Float32Array, dpr: number, time: number) => {
    ctx.clearRect(0, 0, width, height);
    const baseHue = (time * hueShiftSpeed) % 360;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const opacity = squares[i * rows + j];
        let fillStyle;

        switch (colorMode) {
          case "rainbow":
            fillStyle = `hsla(${(baseHue + (i + j) * 5) % 360}, 100%, 70%, ${opacity})`;
            break;
          case "fire":
            fillStyle = `hsla(${30 + Math.random() * 30}, 100%, 50%, ${opacity})`;
            break;
          case "cyberpunk":
            fillStyle = `rgba(${(i + j) % 2 === 0 ? "255, 20, 147" : "0, 255, 255"}, ${opacity})`;
            break;
          case "matrix":
            fillStyle = `rgba(0, 255, 0, ${opacity})`;
            break;
          case "static":
          default:
            fillStyle = `${memoizedColor}${opacity})`;
            break;
        }

        ctx.fillStyle = fillStyle;
        ctx.fillRect(
          i * (squareSize + gridGap) * dpr,
          j * (squareSize + gridGap) * dpr,
          squareSize * dpr,
          squareSize * dpr
        );
      }
    }
  }, [memoizedColor, squareSize, gridGap, colorMode, hueShiftSpeed]);

  useEffect(() => {
    if (!isInView || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let lastTime = 0;
    let gridParams = setupCanvas(canvas, canvasSize.width, canvasSize.height);
    let animationFrameId = requestAnimationFrame(function animate(time) {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      updateSquares(gridParams.squares, deltaTime, gridParams.cols, gridParams.rows);
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr, time / 1000);
      animationFrameId = requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, canvasSize, setupCanvas, updateSquares, drawGrid]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute top-0 left-0 w-full h-full z-0",
        "bg-black/90 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          filter: "blur(1.5px)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};
