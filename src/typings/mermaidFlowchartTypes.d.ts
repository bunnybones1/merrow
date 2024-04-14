/**
 * Generic Diagram DB that may apply to any diagram type.
 */

interface BaseDiagramConfig {
  useWidth?: number
  /**
   * When this flag is set to `true`, the height and width is set to 100%
   * and is then scaled with the available space.
   * If set to `false`, the absolute space required is used.
   *
   */
  useMaxWidth?: boolean
}
interface DiagramDB {
  getConfig?: () => BaseDiagramConfig | undefined
  clear?: () => void
  setDiagramTitle?: (title: string) => void
  getDiagramTitle?: () => string
  setAccTitle?: (title: string) => void
  getAccTitle?: () => string
  setAccDescription?: (description: string) => void
  getAccDescription?: () => string
  setDisplayMode?: (title: string) => void
  bindFunctions?: (element: Element) => void
}

export type MermaidVertexType =
  | "square"
  | "stadium"
  | "subroutine"
  | "cylinder"
  | "circle"
  | "doublecircle"
  | "odd"
  | "diamond"
  | "hexagon"
  | "lean_right"
  | "lean_left"
  | "trapezoid"
  | "inv_trapezoid"
  | "undefined"

export type MermaidVertex = {
  classes: any[]
  domId: string
  id: string
  labelType: "text"
  props: object
  styles: any[]
  text: string
  type: MermaidVertexType
}

export type MermaidEdgeStroke = "normal" | "dotted" | "thick"

export type MermaidEdgeType =
  | "arrow_point"
  | "arrow_open"
  | "double_arrow_point"

export type MermaidEdgeStrokeType = `${MermaidEdgeStroke}-${MermaidEdgeType}`

export type MermaidEdge = {
  end: string
  labelType: "text"
  length: number
  start: string
  stroke: MermaidEdgeStroke
  text: string
  type: MermaidEdgeType
}

export type MermaidFlowchartDiagramDB = DiagramDB & {
  setAccTitle: (txt: string) => void
  getAccTitle: () => string
  getAccDescription: () => string
  setAccDescription: (txt: string) => void
  addVertex: (
    _id: any,
    textObj: any,
    type: any,
    style: any,
    classes: any,
    dir: any,
    props?: object,
  ) => void
  lookUpDomId: (id: any) => any
  addLink: (_start: any, _end: any, type: any) => void
  updateLinkInterpolate: (positions: any, interp: any) => void
  updateLink: (positions: any, style: any) => void
  addClass: (ids: any, style: any) => void
  setDirection: (dir: any) => void
  setClass: (ids: any, className: any) => void
  setTooltip: (ids: any, tooltip: any) => void
  getTooltip: (id: any) => any
  setClickEvent: (ids: any, functionName: any, functionArgs: any) => void
  setLink: (ids: any, linkStr: any, target: any) => void
  bindFunctions: (element: any) => void
  getDirection: () => any
  getVertices: () => { [K: string]: MermaidVertex }
  getEdges: () => MermaidEdge[]
  getClasses: () => any
  clear: (ver?: string) => void
  setGen: (ver: any) => void
  defaultStyle: () => string
  addSubGraph: (_id: any, list: any, _title: any) => any
  getDepthFirstPos: (pos: any) => any
  indexNodes: () => void
  getSubGraphs: () => any[]
  destructLink: (
    _str: any,
    _startStr: any,
  ) => {
    type: string
    stroke: string
  }
  lex: {
    firstGraph: () => boolean
  }
  exists: (allSgs: any, _id: any) => boolean
  makeUniq: (
    sg: any,
    allSubgraphs: any,
  ) => {
    nodes: any[]
  }
  setDiagramTitle: (txt: string) => void
  getDiagramTitle: () => string
}
