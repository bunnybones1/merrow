import type {
  MeshPhysicalMaterialParameters,
  MeshStandardMaterialParameters,
} from "three"
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
} as const

export const physicalMatParamLib: {
  [K in MaterialNames]: MeshPhysicalMaterialParameters
} = {
  gold: {
    color: 0xffd711,
    metalness: 1,
    roughness: 0.35,
    sheen: 1,
    sheenColor: 0xffa70f,
    clearcoat: 0,
    clearcoatRoughness: 0.5,
    iridescence: 0,
    iridescenceIOR: 1,
  },

  copper: {
    color: 0xb87333,
    metalness: 0.85,
    roughness: 0.4,
    sheen: 1,
    sheenColor: 0xffa70f,
    clearcoat: 0,
    clearcoatRoughness: 0.5,
    iridescence: 0,
    iridescenceIOR: 1,
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
    sheen: 1,
    sheenColor: 0xffffff,
    clearcoat: 0.5,
    clearcoatRoughness: 0.55,
  },
} as const
