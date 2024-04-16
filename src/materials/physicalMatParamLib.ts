import { Color, type MeshPhysicalMaterialParameters } from "three"
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
    metalness: 1,
    roughness: 0.3,
    sheen: 0,
    sheenColor: 0xffa70f,
    clearcoat: 0,
    clearcoatRoughness: 0.5,
    iridescence: 0.25,
    iridescenceIOR: 2,
    anisotropy: 0.5,
  },

  iron: {
    color: 0x43464b,
    metalness: 1,
    roughness: 0.6,
    sheen: 1,
    sheenColor: 0xffa70f,
    clearcoat: 0,
    clearcoatRoughness: 0.5,
    iridescence: 0.2,
    iridescenceIOR: 2,
    anisotropy: 0.125,
  },

  steel: {
    color: 0x8c8c8c,
    metalness: 1,
    roughness: 0.3,
    sheen: 0,
    sheenColor: 0xffa70f,
    clearcoat: 0,
    clearcoatRoughness: 0.5,
    iridescence: 0.25,
    iridescenceIOR: 2,
    anisotropy: 0.5,
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

  pearl: {
    color: new Color(2, 2, 2),
    metalness: 0.2,
    roughness: 0.55,
    sheen: 1,
    sheenColor: 0xffa7af,
    clearcoat: 1.82,
    clearcoatRoughness: 0.3,
    iridescence: 2,
    iridescenceIOR: 2,
  },
} as const
