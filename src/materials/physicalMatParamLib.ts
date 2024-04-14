import type { MeshPhysicalMaterialParameters } from "three"
import type { MaterialNames } from "./MaterialNames"

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
    iridescence: 0.2,
    iridescenceIOR: 2,
    anisotropy: 0.125,
  },

  copper: {
    color: 0xb87333,
    metalness: 1,
    roughness: 0.4,
    sheen: 1,
    sheenColor: 0x449922,
    clearcoat: 0,
    clearcoatRoughness: 0.15,
    iridescence: 0.3,
    iridescenceIOR: 1.5,
    anisotropy: 0.75,
    anisotropyRotation: 1,
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
    roughness: 0.25,
    sheen: 1,
    sheenColor: 0xffffff,
    clearcoat: 1,
    clearcoatRoughness: 0.25,
  },
} as const
