"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface FlowAnimationProps {
  isFlowing?: boolean
  flowDirection?: "left" | "right"
  showNebula?: boolean
  particleSize?: number
  colorFrequency?: number
  colors?: string[]
}

const defaultColors = ["white", "#9945FF", "#14F195", "#00C2FF"]

const FlowAnimation: React.FC<FlowAnimationProps> = ({
  isFlowing = false,
  flowDirection = "right",
  showNebula = true,
  particleSize = 3,
  colorFrequency = 0.5,
  colors = defaultColors,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particles, setParticles] = useState<HTMLDivElement[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const createParticle = () => {
      const particle = document.createElement("div")
      const colorIndex = Math.random() < colorFrequency ? Math.floor(Math.random() * (colors.length - 1)) + 1 : 0
      particle.className = `absolute rounded-full`
      particle.style.backgroundColor = colors[colorIndex]
      container.appendChild(particle)

      const size = Math.random() * particleSize + 1
      const startX = Math.random() * canvas.width
      const startY = canvas.height
      const endX = Math.random() * canvas.width
      const endY = -10
      const duration = Math.random() * 5 + 3

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${startX}px`
      particle.style.top = `${startY}px`
      particle.style.opacity = colorIndex === 0 ? "0.7" : "0.5"

      const animation = particle.animate(
        [
          { transform: `translate(0, 0)`, opacity: 0 },
          { opacity: particle.style.opacity, offset: 0.1 },
          { transform: `translate(${endX - startX}px, ${endY - startY}px)`, opacity: 0 },
        ],
        {
          duration: duration * 1000,
          easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        },
      )

      animation.onfinish = () => {
        particle.remove()
        setParticles((prev) => prev.filter((p) => p !== particle))
      }

      setParticles((prev) => [...prev, particle])
    }

    // Nebula gas animation
    const nebulaParticles: { x: number; y: number; radius: number; color: string; vx: number; vy: number }[] = []

    const createNebulaParticle = () => {
      const colors = ["rgba(153, 69, 255, 0.15)", "rgba(20, 241, 149, 0.15)", "rgba(0, 194, 255, 0.15)"]
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 150 + 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
      }
    }

    for (let i = 0; i < 10; i++) {
      nebulaParticles.push(createNebulaParticle())
    }

    const animateNebula = () => {
      if (!showNebula) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nebulaParticles.forEach((particle) => {
        particle.x += particle.vx + (isFlowing ? (flowDirection === "left" ? -2 : 2) : 0)
        particle.y += particle.vy

        if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius
        if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius
        if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius
        if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius

        ctx.beginPath()
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius)
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(0.6, particle.color.replace("0.15)", "0.05)"))
        // @TODO: Need to add a way to update this when theme state changes.
        gradient.addColorStop(1, theme === "dark" ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animateNebula)
    }

    // Start animations immediately
    animateNebula()
    const particleIntervalId = setInterval(createParticle, 300)

    return () => {
      clearInterval(particleIntervalId)
      window.removeEventListener("resize", resizeCanvas)
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [isFlowing, flowDirection, showNebula, particleSize, colorFrequency, colors])

  useEffect(() => {
    if (isFlowing) {
      particles.forEach((particle) => {
        const currentTransform = getComputedStyle(particle).transform
        particle.style.transform = `${currentTransform} translateX(${flowDirection === "left" ? "-" : ""}${window.innerWidth}px)`
      })
    }
  }, [isFlowing, flowDirection, particles])

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </motion.div>
  )
}

export default FlowAnimation


export const FlowAnimationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      {children}
    </div>
  )
}
