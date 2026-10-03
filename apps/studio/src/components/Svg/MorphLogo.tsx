import type { SVGProps } from "react"
import { chakra } from "@chakra-ui/react"

// Morph lockup: three verticals morphing from square corners to a circle —
// an abstract "M". Geometry mirrors brand/lockup.svg.
const _MorphLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={152}
    height={40}
    viewBox="0 0 340 96"
    fill="none"
    role="img"
    aria-label="Morph"
    {...props}
  >
    <defs>
      <linearGradient
        id="morph-logo-gradient"
        gradientUnits="userSpaceOnUse"
        x1="16"
        y1="68"
        x2="82"
        y2="28"
      >
        <stop offset="0" stopColor="#4F46E5" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <rect
      x="16"
      y="28"
      width="12"
      height="40"
      rx="2"
      fill="url(#morph-logo-gradient)"
    />
    <rect
      x="42"
      y="28"
      width="12"
      height="40"
      rx="6"
      fill="url(#morph-logo-gradient)"
    />
    <circle cx="72" cy="48" r="10" fill="url(#morph-logo-gradient)" />
    <text
      x="100"
      y="63"
      fontFamily="ui-sans-serif, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
      fontSize="44"
      fontWeight="700"
      letterSpacing="-1"
      fill="#0F172A"
    >
      Morph
    </text>
  </svg>
)

export const MorphLogo = chakra(_MorphLogo)
