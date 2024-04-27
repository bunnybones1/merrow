import Mermaid from "mermaid"
import {
  type BufferGeometry,
  Color,
  Euler,
  MeshPhysicalMaterial,
  type MeshPhysicalMaterialParameters,
  Object3D,
  type PerspectiveCamera,
  Quaternion,
  type Texture,
  Vector3,
} from "three"
import { Mesh } from "three"
import type { MeshPhysicalNodeMaterialParameters } from "three/examples/jsm/nodes/materials/MeshPhysicalNodeMaterial.js"
import { getChamferedBoxGeometry } from "./geometry/createChamferedBoxGeometry"
import { getChamferedCylinderGeometry } from "./geometry/createChamferedCylinderGeometry"
import { getDoubleGeometry } from "./geometry/createDoubleGeometry"
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
import { getEmojiColor } from "./utils/color/emojiPalette"
import { lerp } from "./utils/math/lerp"
import { makeDetRand } from "./utils/math/makeDetRand"
import { randCentered } from "./utils/math/randCentered"

const __spread = 2
const __minBuffer = 1
const __maxLinkBuffer = 2
const __forceRepel = 0.2
const __forceAttract = 0.05
const __lengthScale = 4

const RADIUS_CONNECTION_DEFAULT = 0.3

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
      0.25,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.075,
    ),
  "thick-arrow_open": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.25,
      0.25,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.075,
    ),
  "thick-double_arrow_point": (detailScale: number) =>
    getChamferedCylinderGeometry(
      0.25,
      0.25,
      ~~(32 * detailScale),
      ~~(11 * detailScale),
      0.075,
    ),
}

class Node {
  potential = new Vector3()
  constructor(
    public mesh: Object3D,
    public radiusCollision = 1,
    public radiusConnection = RADIUS_CONNECTION_DEFAULT,
  ) {
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
    radiusCollision?: number,
    radiusConnection?: number,
  ) {
    super(mesh, radiusCollision, radiusConnection)
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
  constructor(
    public data: MermaidSubGraph,
    mesh: Mesh,
    radiusCollision = 3,
    radiusConnection = 3,
  ) {
    super(mesh, radiusCollision, radiusConnection)
    this.internalPositionScale = 0.98
  }
}
class FlowChart {
  graph = new Graph(new Object3D())
  allGraphs: Graph[] = []
  edges: Edge[] = []
}

const __nodeViewingAngle = new Quaternion()
const __nodeViewingAngleTilt = new Quaternion()
__nodeViewingAngleTilt.setFromEuler(new Euler(0.4, 0, 0))
export function testMermaidFlowchart(
  pivot: Object3D,
  envMap: Texture,
  camera: PerspectiveCamera,
) {
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
        const leafNodes: LeafNode[] = []
        const edges: Edge[] = []
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
        let isolatedNodeMesh: Object3D | undefined
        function onClickNodeMesh(this: Object3D) {
          if (isolatedNodeMesh !== this) {
            isolatedNodeMesh = this
            for (const node of leafNodes) {
              node.mesh.visible = this === node.mesh
            }
            for (const edge of edges) {
              edge.mesh.visible =
                this === edge.nodeA.mesh || this === edge.nodeB.mesh
              if (edge.mesh.visible) {
                edge.nodeA.mesh.visible = true
                edge.nodeB.mesh.visible = true
              }
            }
          } else {
            isolatedNodeMesh = undefined
            for (const node of leafNodes) {
              node.mesh.visible = true
            }
            for (const edge of edges) {
              edge.mesh.visible = true
            }
          }
        }
        for (const vId of Object.keys(vertDatas)) {
          if (subGraphDatas.some((sgd) => sgd.id === vId)) {
            continue
          }
          const vert = vertDatas[vId]
          let radiusCollision = 1
          let radiusConnection = RADIUS_CONNECTION_DEFAULT
          let geo = mermaidNodeGeometryMakers[vert.type || "undefined"]()
          let matParams = vert.text.includes("🪙")
            ? physicalMatParamLib.steel
            : physicalMatParamLib.whitePlastic
          if (vert.text.includes("🖥️")) {
            geo = getChamferedBoxGeometry(4, 3, 0.5, 0.05)
            radiusCollision = 3
            radiusConnection = 0.2
          } else if (vert.text.includes("💾")) {
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
          const emojiColor = getEmojiColor(vert.text)
          if (emojiColor) {
            matParams = {
              ...matParams,
              color: emojiColor,
            }
          }
          const nodeMaterial = new MeshPhysicalMaterial({
            ...matParams,
            envMap,
            flatShading: geo.userData.requestFlatShading,
          })
          const nodeMesh = new Mesh(geo, nodeMaterial)
          nodeMesh.userData.labelString = vert.text
          nodeMesh.userData.onClick = onClickNodeMesh.bind(nodeMesh)

          nodeMesh.position.set(
            randCentered(__spread, 0, detRand),
            randCentered(__spread, 0, detRand),
            randCentered(__spread, 0, detRand),
          )

          if (vert.text.includes("🖥️")) {
            const extraMesh = new Mesh(
              getChamferedBoxGeometry(4 - 0.3, 3 - 0.3, 0.5 + 0.1, 0.05),
              new MeshPhysicalMaterial({
                ...physicalMatParamLib.pearl,
                color: new Color(0),
              }),
            )
            extraMesh.userData.notSelectable = true

            nodeMesh.add(extraMesh)
          }
          pivot.add(nodeMesh)
          nodeMesh.userData.connectedMeshes = []
          const leafNode = new LeafNode(
            vert,
            nodeMesh,
            radiusCollision,
            radiusConnection,
          )
          leafNodeBank.set(vId, leafNode)
          leafNodes.push(leafNode)
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
          let geo = mermaidEdgeGeometryMakers[edgeMeshType](
            edgeData.length * __lengthScale * 0.5,
            0.2,
          )
          let matParams: MeshPhysicalMaterialParameters = {
            ...(edgeData.text.includes("🪙")
              ? physicalMatParamLib.steel
              : physicalMatParamLib.whitePlastic),
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
          const emojiColor = getEmojiColor(edgeData.text)
          if (emojiColor) {
            matParams = {
              ...matParams,
              color: emojiColor,
            }
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
          if (edgeData.type === "double_arrow_point") {
            geo = getDoubleGeometry(geo, new Vector3(0.3, 0, 0))
          }
          const linkMesh = new Mesh(geo, linkMaterial)
          const meshA = leafNodeBank.get(edgeData.start)?.mesh
          const meshB = leafNodeBank.get(edgeData.end)?.mesh
          if (!meshA || !meshB) {
            throw new Error("mesh missing")
          }
          linkMesh.userData.connectedMeshes = [meshA, meshB]
          meshA.userData.connectedMeshes.push(linkMesh)
          meshB.userData.connectedMeshes.push(linkMesh)
          linkMesh.userData.labelString = edgeData.text
          linkMesh.userData.isEdge = true
          const subMeshes: Mesh[] = []
          if (isSegmented) {
            const sublinkMaterial = new MeshPhysicalMaterial(matParams)
            for (
              let i = 0;
              i <
              edgeData.length *
                __lengthScale *
                2 *
                (edgeData.type === "double_arrow_point" ? 2 : 1);
              i++
            ) {
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
          const edge = new Edge(
            edgeData,
            linkMesh,
            getBankedNode(edgeData.start),
            getBankedNode(edgeData.end),
            subMeshes,
          )
          edges.push(edge)
          flowChart.edges.push(edge)
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
          node.radiusCollision =
            Math.max(...node.nodes.map((n) => n.radiusCollision)) + 1
          node.mesh.scale.setScalar(node.radiusCollision)
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
            const dist =
              pA.distanceTo(pB) - nodeA.radiusCollision - nodeB.radiusCollision
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
        const dist1 =
          pA.distanceTo(pB) -
          edge.nodeA.radiusCollision -
          edge.nodeB.radiusCollision
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
        const dist2 =
          pA.distanceTo(pB) -
          edge.nodeA.radiusCollision -
          edge.nodeB.radiusCollision
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
          totalRadius += node.radiusCollision
        }
        for (const node of graph.nodes) {
          temp2
            .copy(node.mesh.position)
            .multiplyScalar(node.radiusCollision / totalRadius)
          centroid.add(temp2)
        }
        temp2.subVectors(graph.mesh.position, centroid).multiplyScalar(0.15)
        for (const node of graph.nodes) {
          node.potential.add(temp2)
          temp.subVectors(node.mesh.position, centroid)
          maxRadius = Math.max(
            maxRadius,
            temp.length() + node.radiusCollision + __minBuffer * 0.5,
          )
          temp.multiplyScalar(0.01)
          node.potential.sub(temp)
        }
        centroid.sub(graph.mesh.position)
        graph.potential.add(centroid.clone().multiplyScalar(0.1))
        graph.radiusCollision = lerp(graph.radiusCollision, maxRadius, 0.1)
        graph.mesh.scale.setScalar(graph.radiusCollision)
      }
      __nodeViewingAngle.copy(camera.quaternion)
      __nodeViewingAngle.multiply(__nodeViewingAngleTilt)
      for (const graph of flowchart.allGraphs) {
        for (const node of graph.nodes) {
          node.integratePotential()
          node.mesh.quaternion.copy(__nodeViewingAngle)
        }
      }
      for (const edge of flowchart.edges) {
        const nA = edge.nodeA
        const nB = edge.nodeB
        const pA = nA.mesh.position
        const pB = nB.mesh.position
        const totalRadii = nA.radiusConnection + nB.radiusConnection
        temp.subVectors(pA, pB)
        const dist = temp.length()
        const gap = dist - totalRadii
        edge.mesh.position.lerpVectors(
          pA,
          pB,
          (nA.radiusConnection + gap * 0.5) / dist,
        )
        temp.normalize()
        edge.mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), temp)
        edge.mesh.scale.y = (gap * 0.25) / edge.data.length
        for (let ism = 0; ism < edge.subMeshes.length; ism++) {
          const direction =
            edge.data.type === "double_arrow_point" && ism % 2 === 0 ? 1 : -1
          const subMesh = edge.subMeshes[ism]
          subMesh.position.x =
            edge.data.type === "double_arrow_point" ? direction * 0.15 : 0
          subMesh.position.y =
            ((((timeNow * (edge.data.type !== "arrow_open" ? 0.001 : 0) + ism) /
              edge.subMeshes.length) %
              1) -
              0.5) *
            edge.data.length *
            __lengthScale *
            direction
        }
      }
    }
  }
  // const i = parse.parse("info", "a --> b")
  // debugger
}
