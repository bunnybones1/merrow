import type { MeshStandardMaterialParameters } from "three"
import type { MaterialNames } from "./MaterialNames"

export const standardMatParamLib: {
  [K in MaterialNames]: MeshStandardMaterialParameters
} = {
  gold: {
    color: 0xffd700,
    metalness: 0.85,
    roughness: 0.2,
  },

  copper: {
    color: 0xb87333,
    metalness: 0.85,
    roughness: 0.4,
  },

  aluminum: {
    color: 0xcccccc,
    metalness: 0.7,
    roughness: 0.3,
  },

  iron: {
    color: 0x43464b,
    metalness: 0.85,
    roughness: 0.6,
  },

  castIron: {
    color: 0x222222,
    metalness: 0.95,
    roughness: 0.8,
  },

  steel: {
    color: 0x8c8c8c,
    metalness: 0.85,
    roughness: 0.5,
  },

  whitePlastic: {
    color: 0xffffff,
    metalness: 0,
    roughness: 0.5,
  },

  pearl: {
    color: 0xffdddd,
    metalness: 0.3,
    roughness: 0.75,
  },

  bubble: {
    color: 0xffffff,
    metalness: 0.3,
    roughness: 0.75,
    opacity: 0.2,
    transparent: true,
  },
  cyber: {
    color: 0x00ff00,
    metalness: 0.3,
    roughness: 0.75,
    wireframe: true,
  },
} as const
