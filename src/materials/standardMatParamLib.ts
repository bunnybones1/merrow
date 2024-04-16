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
} as const
