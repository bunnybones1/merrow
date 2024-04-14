import Mermaid from "mermaid"
import { type BufferGeometry, type Object3D, Vector3 } from "three"
import { MeshStandardMaterial } from "three"
import { Mesh } from "three"
import { getChamferedCylinderGeometry } from "./geometry/createChamferedCylinderGeometry"
import { getIcoSphereGeometry } from "./geometry/createIcoSphereGeometry"
import { getOctahedronGeometry } from "./geometry/createOctahedronGeometry"
import { getTetrahedronGeometry } from "./geometry/createTetrahedronGeometry"
import { standardMatParamLib } from "./materials/standardMatParamLib"
import mermaidtext from "./mermaid-flowchart.md?raw"
import type {
  MermaidEdge,
  MermaidEdgeStrokeType,
  MermaidFlowchartDiagramDB,
  MermaidVertex,
  MermaidVertexType,
} from "./typings/mermaidFlowchartTypes"
import { randCentered } from "./utils/math/randCentered"

const regex = /(?<=\`\`\`mermaid\n)([\s\S]*?)(?=\n\`\`\`)/g

const mermaidNodeGeometryMakers: {
  [K in MermaidVertexType]: () => BufferGeometry
} = {
  undefined: () => getChamferedCylinderGeometry(1, 1, 32, 11, 0.05),
  square: () => getChamferedCylinderGeometry(1, 1, 32, 11, 0.05),
  stadium: () => getChamferedCylinderGeometry(0.8, 1, 32, 11, 0.95),
  subroutine: () => getChamferedCylinderGeometry(0.6, 1, 32, 11, 0.05),
  cylinder: () => getChamferedCylinderGeometry(1, 1, 32, 11, 0.05),
  circle: () => getIcoSphereGeometry(1, 4),
  doublecircle: () => getIcoSphereGeometry(1.25, 4),
  odd: () => getOctahedronGeometry(1, 1),
  diamond: () => getOctahedronGeometry(1, 0),
  hexagon: () => getIcoSphereGeometry(1, 1),
  lean_right: () => getTetrahedronGeometry(1, 0),
  lean_left: () => getTetrahedronGeometry(1, 0),
  trapezoid: () => getTetrahedronGeometry(1, 1),
  inv_trapezoid: () => getTetrahedronGeometry(1, 1),
}

const mermaidEdgeGeometryMakers: {
  [K in MermaidEdgeStrokeType]: () => BufferGeometry
} = {
  "normal-arrow_point": () =>
    getChamferedCylinderGeometry(0.2, 1, 32, 11, 0.05),
  "normal-arrow_open": () => getChamferedCylinderGeometry(0.2, 1, 32, 11, 0.05),
  "normal-double_arrow_point": () =>
    getChamferedCylinderGeometry(0.2, 1, 32, 11, 0.05),
  "dotted-arrow_point": () =>
    getChamferedCylinderGeometry(0.2, 1, 32, 11, 0.05),
  "dotted-arrow_open": () => getChamferedCylinderGeometry(0.2, 1, 32, 11, 0.05),
  "dotted-double_arrow_point": () =>
    getChamferedCylinderGeometry(0.2, 1, 32, 11, 0.05),
  "thick-arrow_point": () => getChamferedCylinderGeometry(0.2, 1, 32, 11, 0.05),
  "thick-arrow_open": () => getChamferedCylinderGeometry(0.2, 1, 32, 11, 0.05),
  "thick-double_arrow_point": () =>
    getChamferedCylinderGeometry(0.2, 1, 32, 11, 0.05),
}

class Node {
  potential = new Vector3()
  constructor(
    public data: MermaidVertex,
    public mesh: Mesh,
  ) {
    //
  }
  integratePotential() {
    this.mesh.position.add(this.potential)
    this.potential.set(0, 0, 0)
  }
}
class Edge {
  constructor(
    public data: MermaidEdge,
    public mesh: Mesh,
  ) {
    //
  }
}
class FlowChart {
  nodes: Node[] = []
  edges: Edge[] = []
}

const __spread = 2
const __minDistance = 3

export function testMermaidFlowchart(pivot: Object3D) {
  const vertMaterial = new MeshStandardMaterial(
    standardMatParamLib.whitePlastic,
  )
  const edgeMaterial = new MeshStandardMaterial(standardMatParamLib.gold)
  // for (let i = 0; i < 3; i++) {
  //   const height = 0.2 + i * 0.25
  //   for (let j = 0; j < 3; j++) {
  //   }
  // }
  const flowcharts: FlowChart[] = []
  Mermaid.mermaidAPI.initialize()
  async function asyncWork() {
    const flowChartStrings = [...(mermaidtext as string).matchAll(regex)]
    for (const flowchartMatch of flowChartStrings) {
      const flowchartString = flowchartMatch[0]
      try {
        const d = await Mermaid.mermaidAPI.getDiagramFromText(flowchartString)
        const parsed = d.getParser().parser.yy as MermaidFlowchartDiagramDB
        const verts = parsed.getVertices()
        const edges = parsed.getEdges()
        const flowChart = new FlowChart()
        for (const vId of Object.keys(verts)) {
          const vert = verts[vId]
          const geo = mermaidNodeGeometryMakers[vert.type || "undefined"]
          const nodeMesh = new Mesh(geo(), vertMaterial)
          nodeMesh.position.set(
            randCentered(__spread),
            randCentered(__spread),
            randCentered(__spread),
          )
          pivot.add(nodeMesh)
          flowChart.nodes.push(new Node(vert, nodeMesh))
        }
        for (const edge of edges) {
          const edgeMeshType = `${edge.stroke}-${edge.type}` as const
          const geo = mermaidEdgeGeometryMakers[edgeMeshType]
          const linkMesh = new Mesh(geo(), edgeMaterial)
          linkMesh.position.set(
            randCentered(8),
            randCentered(8),
            randCentered(8),
          )
          pivot.add(linkMesh)
          flowChart.edges.push(new Edge(edge, linkMesh))
        }
        flowcharts.push(flowChart)
      } catch (e: unknown) {
        console.error(e)
      }
    }
  }
  asyncWork()
  return function simulationTick() {
    const temp = new Vector3()
    for (const flowchart of flowcharts) {
      for (const nodeA of flowchart.nodes) {
        for (const nodeB of flowchart.nodes) {
          const pA = nodeA.mesh.position
          const pB = nodeB.mesh.position
          const dist = pA.distanceTo(pB)
          const push = Math.max(0, __minDistance - dist)
          // -0.5 = Math.max(0, 2-2.5)
          // 0.5 = Math.max(0, 2-1.5)
          if (push > 0) {
            temp.subVectors(pA, pB).normalize().multiplyScalar(0.1)
            nodeA.potential.add(temp)
            nodeB.potential.sub(temp)
          }
        }
      }
      for (const node of flowchart.nodes) {
        node.integratePotential()
      }
    }
  }
  // const i = parse.parse("info", "a --> b")
  // debugger
}
