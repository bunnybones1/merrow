import Mermaid from "mermaid"
import {
  type BufferGeometry,
  DoubleSide,
  MeshPhysicalMaterial,
  type MeshPhysicalMaterialParameters,
  Object3D,
  type Texture,
  Vector3,
} from "three"
import { Mesh } from "three"
import type { MeshPhysicalNodeMaterialParameters } from "three/examples/jsm/nodes/materials/MeshPhysicalNodeMaterial.js"
import { getChamferedCylinderGeometry } from "./geometry/createChamferedCylinderGeometry"
import { getIcoSphereGeometry } from "./geometry/createIcoSphereGeometry"
import { getOctahedronGeometry } from "./geometry/createOctahedronGeometry"
import { getTetrahedronGeometry } from "./geometry/createTetrahedronGeometry"
import { getTripleChamferedCylinderGeometry } from "./geometry/createTripleChamferedCylinderGeometry"
import { getWireBoxGeometry } from "./geometry/createWireBoxGeometry"
import { physicalMatParamLib } from "./materials/physicalMatParamLib"
import mermaidtext from "./mermaid-flowchart-private.md?raw"
import type {
  MermaidEdge,
  MermaidEdgeStrokeType,
  MermaidFlowchartDiagramDB,
  MermaidSubGraph,
  MermaidVertex,
  MermaidVertexType,
} from "./typings/mermaidFlowchartTypes"
import { lerp } from "./utils/math/lerp"
import { makeDetRand } from "./utils/math/makeDetRand"
import { randCentered } from "./utils/math/randCentered"

const __spread = 2
const __minBuffer = 1
const __maxLinkBuffer = 2
const __forceRepel = 0.2
const __forceAttract = 0.05
const __lengthScale = 4

const regex = /(?<=\`\`\`mermaid\n)([\s\S]*?)(?=\n\`\`\`)/g

const detRand = makeDetRand()
const mermaidNodeGeometryMakers: {
  [K in MermaidVertexType]: () => BufferGeometry
} = {
  undefined: () => getChamferedCylinderGeometry(1, 1, 32, 11, 0.05),
  square: () => getChamferedCylinderGeometry(1, 1, 8, 11, 0.15, true),
  stadium: () => getChamferedCylinderGeometry(1, 1, 32, 11, 0.5),
  subroutine: () => getChamferedCylinderGeometry(0.6, 1, 6, 15, 0.25, true),
  cylinder: () => getChamferedCylinderGeometry(1, 1, 32, 11, 0.05),
  circle: () => getIcoSphereGeometry(1, 4),
  doublecircle: () => getIcoSphereGeometry(1.25, 4),
  odd: () => getOctahedronGeometry(1, 1, true),
  diamond: () => getOctahedronGeometry(1, 0, true),
  hexagon: () => getIcoSphereGeometry(1, 1, true),
  lean_right: () => getTetrahedronGeometry(1, 0, true),
  lean_left: () => getTetrahedronGeometry(1, 0, true),
  trapezoid: () => getTetrahedronGeometry(1, 1, true),
  inv_trapezoid: () => getTetrahedronGeometry(1, 1, true),
}

const mermaidEdgeGeometryMakers: {
  [K in MermaidEdgeStrokeType]: (
    length: number,
    detailScale: number,
  ) => BufferGeometry
} = {
  "normal-arrow_point": (length: number, detailScale: number) =>
    getChamferedCylinderGeometry(
      0.2,
      length,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "normal-arrow_open": (length: number, detailScale: number) =>
    getChamferedCylinderGeometry(
      0.2,
      length,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "normal-double_arrow_point": (length: number, detailScale: number) =>
    getChamferedCylinderGeometry(
      0.2,
      length,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "dotted-arrow_point": (length: number, detailScale: number) =>
    getChamferedCylinderGeometry(
      0.2,
      length,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "dotted-arrow_open": (length: number, detailScale: number) =>
    getChamferedCylinderGeometry(
      0.2,
      length,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "dotted-double_arrow_point": (length: number, detailScale: number) =>
    getChamferedCylinderGeometry(
      0.2,
      length,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "thick-arrow_point": (length: number, detailScale: number) =>
    getChamferedCylinderGeometry(
      0.3,
      length,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "thick-arrow_open": (length: number, detailScale: number) =>
    getChamferedCylinderGeometry(
      0.3,
      length,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "thick-double_arrow_point": (length: number, detailScale: number) =>
    getChamferedCylinderGeometry(
      0.3,
      length,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
}

const mermaidSubEdgeGeometryMakers: {
  [K in MermaidEdgeStrokeType]: (detailScale: number) => BufferGeometry
} = {
  "normal-arrow_point": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.15,
      0.25,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "normal-arrow_open": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.15,
      0.25,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "normal-double_arrow_point": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.15,
      0.25,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.05,
    ),
  "dotted-arrow_point": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.15,
      0.15,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.125,
    ),
  "dotted-arrow_open": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.15,
      0.15,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.125,
    ),
  "dotted-double_arrow_point": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.15,
      0.15,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.125,
    ),
  "thick-arrow_point": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.25,
      0.33,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.125,
    ),
  "thick-arrow_open": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.25,
      0.33,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.125,
    ),
  "thick-double_arrow_point": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.25,
      0.33,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.125,
    ),
}

class Node {
  radius = 1
  potential = new Vector3()
  constructor(public mesh: Object3D) {
    //
  }
  integratePotential() {
    this.mesh.position.add(this.potential.clone().multiplyScalar(0.025))
    this.potential.multiplyScalar(0.965)
    // this.potential.set(0, 0, 0)
  }
}
class LeafNode extends Node {
  constructor(
    public data: MermaidVertex,
    mesh: Object3D,
  ) {
    super(mesh)
  }
}
class Edge {
  constructor(
    public data: MermaidEdge,
    public mesh: Object3D,
    public nodeA: Node,
    public nodeB: Node,
    public subMeshes: Mesh[],
  ) {
    //
  }
}
class Graph extends Node {
  internalPositionScale = 0.99
  getNode(id: string): LeafNode | SubGraph {
    const node = this.nodesById.get(id)
    if (!node) {
      throw new Error(`Cannot find node/subgraph with id: ${id}`)
    }
    return node
  }
  add(node: LeafNode | SubGraph) {
    this.nodes.push(node)
    this.nodesById.set(node.data.id, node)
  }
  nodes: (LeafNode | SubGraph)[] = []
  nodesById: Map<string, LeafNode | SubGraph> = new Map()
}

class SubGraph extends Graph {
  radius = 3
  constructor(
    public data: MermaidSubGraph,
    mesh: Mesh,
  ) {
    super(mesh)
    this.internalPositionScale = 0.98
  }
}
class FlowChart {
  graph = new Graph(new Object3D())
  allGraphs: Graph[] = []
  edges: Edge[] = []
}

export function testMermaidFlowchart(pivot: Object3D, envMap: Texture) {
  const flowcharts: FlowChart[] = []
  Mermaid.mermaidAPI.initialize()
  async function asyncWork() {
    const flowChartStrings = [...(mermaidtext as string).matchAll(regex)]
    for (const flowchartMatch of flowChartStrings) {
      const flowchartString = flowchartMatch[0]
      try {
        const d = await Mermaid.mermaidAPI.getDiagramFromText(flowchartString)
        const parsed = d.getParser().parser.yy as MermaidFlowchartDiagramDB
        const vertDatas = parsed.getVertices()
        const edgeDatas = parsed.getEdges()
        const subGraphDatas = parsed.getSubGraphs()
        const flowChart = new FlowChart()
        const leafNodeBank = new Map<string, LeafNode>()
        function getBankedLeafNode(id: string) {
          const n = leafNodeBank.get(id)
          if (!n) {
            throw new Error(`No leafNode with id ${id}`)
          }
          return n
        }
        function withdrawBankedLeafNode(id: string) {
          const n = getBankedLeafNode(id)
          leafNodeBank.delete(id)
          return n
        }
        const subGraphBank = new Map<string, SubGraph>()
        function withdrawSubGraph(id: string) {
          const sg = subGraphBank.get(id)
          if (!sg) {
            throw new Error(`No subGraph with id: ${id}`)
          }
          subGraphBank.delete(id)
          return sg
        }
        function getBankedNode(id: string) {
          const n = leafNodeBank.get(id) || subGraphBank.get(id)
          if (!n) {
            throw new Error(`No node with id ${id}`)
          }
          return n
        }
        for (const vId of Object.keys(vertDatas)) {
          if (subGraphDatas.some((sgd) => sgd.id === vId)) {
            continue
          }
          const vert = vertDatas[vId]
          let geo = mermaidNodeGeometryMakers[vert.type || "undefined"]()
          let matParams = physicalMatParamLib.whitePlastic
          if (vert.text.includes("💾")) {
            matParams = physicalMatParamLib.cyber
            geo = getWireBoxGeometry(1, 0, false)
          } else if (vert.text.includes("🔑")) {
            matParams = physicalMatParamLib.aluminum
            geo = getOctahedronGeometry(1, 0, true)
          } else if (vert.text.includes("🚪")) {
            matParams = physicalMatParamLib.copper
            geo = getOctahedronGeometry(1, 0, true)
          } else if (vert.text.includes("📤")) {
            matParams = physicalMatParamLib.steel
            geo = getOctahedronGeometry(1, 1, true)
          } else if (vert.text.includes("⛓️")) {
            matParams = physicalMatParamLib.castIron
            geo = getTripleChamferedCylinderGeometry(1, 1, 32, 11, 0.05, false)
          } else if (vert.text.includes("🗄️")) {
            matParams = physicalMatParamLib.copper
            geo = getTripleChamferedCylinderGeometry(1, 1, 32, 11, 0.05, false)
          } else if (vert.text.includes("🧑") || vert.text.includes("👷")) {
            matParams = physicalMatParamLib.gold
          }
          if (vert.text.includes("🟢")) {
            matParams = physicalMatParamLib.greenPlastic
          } else if (vert.text.includes("🟣")) {
            matParams = physicalMatParamLib.metalPurple
          } else if (vert.text.includes("🔵")) {
            matParams = physicalMatParamLib.metalBlue
          }
          const nodeMaterial = new MeshPhysicalMaterial({
            ...matParams,
            envMap,
            flatShading: geo.userData.requestFlatShading,
          })
          const nodeMesh = new Mesh(geo, nodeMaterial)
          nodeMesh.userData.labelString = vert.text

          nodeMesh.position.set(
            randCentered(__spread, 0, detRand),
            randCentered(__spread, 0, detRand),
            randCentered(__spread, 0, detRand),
          )
          pivot.add(nodeMesh)
          leafNodeBank.set(vId, new LeafNode(vert, nodeMesh))
        }
        for (const subGraphData of subGraphDatas) {
          const geo = getIcoSphereGeometry(1, 6)
          const matParams: MeshPhysicalNodeMaterialParameters = {
            ...physicalMatParamLib.bubble,
            envMap,
            flatShading: geo.userData.requestFlatShading,
          }
          const subGraphMaterial = new MeshPhysicalMaterial(matParams)
          const subGraphMesh = new Mesh(geo, subGraphMaterial)
          subGraphMesh.userData.notSelectable = true
          subGraphMesh.position.set(
            randCentered(__spread, 0, detRand),
            randCentered(__spread, 0, detRand),
            randCentered(__spread, 0, detRand),
          )
          pivot.add(subGraphMesh)
          subGraphBank.set(
            subGraphData.id,
            new SubGraph(subGraphData, subGraphMesh),
          )
        }
        for (const edgeData of edgeDatas) {
          const edgeMeshType = `${edgeData.stroke}-${edgeData.type}` as const
          const geo = mermaidEdgeGeometryMakers[edgeMeshType](
            edgeData.length * __lengthScale * 0.5,
            0.2,
          )
          let matParams: MeshPhysicalMaterialParameters = {
            ...physicalMatParamLib.gold,
            envMap,
            flatShading: geo.userData.requestFlatShading,
          }
          let subGeo = mermaidSubEdgeGeometryMakers[edgeMeshType](1)
          if (edgeData.text.includes("🚀")) {
            matParams = physicalMatParamLib.cyber
            subGeo = mermaidSubEdgeGeometryMakers[edgeMeshType](0.2)
          } else if (edgeData.text.includes("📊")) {
            matParams = physicalMatParamLib.steel
          } else if (edgeData.text.includes("🔑")) {
            matParams = physicalMatParamLib.aluminum
          } else if (edgeData.text.includes("⛓️")) {
            matParams = physicalMatParamLib.castIron
          }
          if (edgeData.text.includes("🟢")) {
            matParams = physicalMatParamLib.greenPlastic
          } else if (edgeData.text.includes("🟣")) {
            matParams = physicalMatParamLib.metalPurple
          } else if (edgeData.text.includes("🔵")) {
            matParams = physicalMatParamLib.metalBlue
          }
          const isSegmented =
            edgeData.type !== "arrow_open" || edgeData.stroke === "dotted"
          const linkMaterial = new MeshPhysicalMaterial(
            isSegmented
              ? {
                  ...matParams,
                  alphaHash: true,
                  opacity: 0.2,
                  wireframe: false,
                }
              : matParams,
          )
          const linkMesh = new Mesh(geo, linkMaterial)
          linkMesh.userData.connectedMeshes = [
            leafNodeBank.get(edgeData.start)?.mesh,
            leafNodeBank.get(edgeData.end)?.mesh,
          ]
          linkMesh.userData.labelString = edgeData.text
          const subMeshes: Mesh[] = []
          if (isSegmented) {
            const sublinkMaterial = new MeshPhysicalMaterial(matParams)
            for (let i = 0; i < edgeData.length * __lengthScale * 2; i++) {
              const linkSubMesh = new Mesh(subGeo, sublinkMaterial)
              subMeshes.push(linkSubMesh)
              linkMesh.add(linkSubMesh)
            }
          }
          linkMesh.position.set(
            randCentered(__spread, 0, detRand),
            randCentered(__spread, 0, detRand),
            randCentered(__spread, 0, detRand),
          )
          pivot.add(linkMesh)
          flowChart.edges.push(
            new Edge(
              edgeData,
              linkMesh,
              getBankedNode(edgeData.start),
              getBankedNode(edgeData.end),
              subMeshes,
            ),
          )
        }
        flowChart.allGraphs.push(flowChart.graph)
        for (const subGraph of [...subGraphBank.values()]) {
          flowChart.allGraphs.push(subGraph)
          for (const nodeId of subGraph.data.nodes) {
            if (subGraphBank.has(nodeId)) {
              const ssg = withdrawSubGraph(nodeId)
              subGraph.add(ssg)
            } else if (leafNodeBank.has(nodeId)) {
              subGraph.add(withdrawBankedLeafNode(nodeId))
            }
          }
        }
        for (const subGraph of [...subGraphBank.values()]) {
          flowChart.graph.add(subGraph)
        }
        for (const leafNode of [...leafNodeBank.values()]) {
          flowChart.graph.add(leafNode)
        }
        function recursiveGrow(node: Graph) {
          for (const child of node.nodes) {
            if (child instanceof SubGraph) {
              recursiveGrow(child)
            }
          }
          node.radius = Math.max(...node.nodes.map((n) => n.radius)) + 1
          node.mesh.scale.setScalar(node.radius)
        }
        recursiveGrow(flowChart.graph)
        flowcharts.push(flowChart)
      } catch (e: unknown) {
        console.error(e)
      }
    }
  }
  asyncWork()
  return function simulationTick() {
    const timeNow = performance.now()
    const centroid = new Vector3()
    const temp = new Vector3()
    const temp2 = new Vector3()
    for (const flowchart of flowcharts) {
      for (const graph of flowchart.allGraphs) {
        for (let ia = 0; ia < graph.nodes.length; ia++) {
          const nodeA = graph.nodes[ia]
          for (let ib = ia + 1; ib < graph.nodes.length; ib++) {
            const nodeB = graph.nodes[ib]
            const pA = nodeA.mesh.position
            const pB = nodeB.mesh.position
            const dist = pA.distanceTo(pB) - nodeA.radius - nodeB.radius
            const minDistance = __minBuffer
            const push = Math.max(0, minDistance - dist)
            if (push > 0) {
              temp.subVectors(pA, pB)
              const dist2 = temp.length()
              temp.normalize().multiplyScalar(Math.min(dist2, __forceRepel))
              nodeA.potential.add(temp)
              nodeB.potential.sub(temp)
            }
          }
        }
      }
      for (const edge of flowchart.edges) {
        const pA = edge.nodeA.mesh.position
        const pB = edge.nodeB.mesh.position
        const dist1 = pA.distanceTo(pB) - edge.nodeA.radius - edge.nodeB.radius
        const maxLinkDistance =
          __maxLinkBuffer + edge.data.length * __lengthScale
        const pull = Math.max(0, dist1 - maxLinkDistance)
        if (pull > 0) {
          temp.subVectors(pA, pB)
          const dist2 = temp.length()
          temp.normalize().multiplyScalar(-Math.min(dist2, __forceAttract))
          edge.nodeA.potential.add(temp)
          edge.nodeB.potential.sub(temp)
        }
        const dist2 = pA.distanceTo(pB) - edge.nodeA.radius - edge.nodeB.radius
        const minDistance = __minBuffer + edge.data.length * __lengthScale
        const push = Math.max(0, minDistance - dist2)
        if (push > 0) {
          temp.subVectors(pA, pB)
          const dist2 = temp.length()
          temp.normalize().multiplyScalar(Math.min(dist2, __forceAttract))
          edge.nodeA.potential.add(temp)
          edge.nodeB.potential.sub(temp)
        }
      }
      for (const graph of flowchart.allGraphs) {
        centroid.set(0, 0, 0)
        let maxRadius = 0
        let totalRadius = 0
        for (const node of graph.nodes) {
          totalRadius += node.radius
        }
        for (const node of graph.nodes) {
          temp2
            .copy(node.mesh.position)
            .multiplyScalar(node.radius / totalRadius)
          centroid.add(temp2)
        }
        temp2.subVectors(graph.mesh.position, centroid).multiplyScalar(0.15)
        for (const node of graph.nodes) {
          node.potential.add(temp2)
          temp.subVectors(node.mesh.position, centroid)
          maxRadius = Math.max(
            maxRadius,
            temp.length() + node.radius + __minBuffer * 0.5,
          )
          temp.multiplyScalar(0.01)
          node.potential.sub(temp)
        }
        centroid.sub(graph.mesh.position)
        graph.potential.add(centroid.clone().multiplyScalar(0.1))
        graph.radius = lerp(graph.radius, maxRadius, 0.1)
        graph.mesh.scale.setScalar(graph.radius)
      }
      for (const graph of flowchart.allGraphs) {
        for (const node of graph.nodes) {
          node.integratePotential()
        }
      }
      for (const edge of flowchart.edges) {
        const nA = edge.nodeA
        const nB = edge.nodeB
        const pA = nA.mesh.position
        const pB = nB.mesh.position
        edge.mesh.position.lerpVectors(
          pA,
          pB,
          nA.radius / (nA.radius + nB.radius),
        )
        temp.subVectors(pA, pB)
        const dist = temp.length() * 0.25
        temp.normalize()
        edge.mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), temp)
        edge.mesh.scale.y = dist / edge.data.length
        for (let ism = 0; ism < edge.subMeshes.length; ism++) {
          const subMesh = edge.subMeshes[ism]
          subMesh.position.y =
            ((((timeNow * (edge.data.type !== "arrow_open" ? 0.001 : 0) + ism) /
              edge.subMeshes.length) %
              1) -
              0.5) *
            edge.data.length *
            __lengthScale *
            (edge.data.type === "double_arrow_point" && ism % 2 === 0 ? 1 : -1)
        }
      }
    }
  }
  // const i = parse.parse("info", "a --> b")
  // debugger
}
