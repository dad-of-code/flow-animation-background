# Flow Animation Component

A customizable React component that creates an animated background effect with floating particles and a nebula-like gas animation. Built for Next.js applications with theme support.

## Features

- Floating particles with customizable colors and sizes
- Nebula gas effect with theme-aware blending
- Responsive design that adapts to window resizing
- Support for light/dark mode themes
- Configurable animation direction and flow states
- Zero-config default settings

## Installation

The component requires the following dependencies:
- framer-motion
- next-themes

## Usage

```tsx
// Basic usage with default settings
import { FlowAnimation, FlowAnimationProvider } from './components/ui/flow-animation'

export default function Page() {
  return (
    <FlowAnimationProvider>
      <FlowAnimation />
      {/* Your content here */}
    </FlowAnimationProvider>
  )
}

// Custom configuration
<FlowAnimation 
  isFlowing={true}
  flowDirection="left"
  colors={["#ffffff", "#ff0000", "#00ff00", "#0000ff"]}
  colorFrequency={0.7}
/>
