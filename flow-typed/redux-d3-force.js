declare type D3Forces = {
  [string]: {
    force?: () => any,
    options?:
      | { [string]: any }
      | ((options: D3ForceOptions) => { [string]: any })
  }
};

declare type D3Node = {
  id: number | string,
  radius: number,
  fy?: number,
  fx?: number
};

declare type D3Link = {
  source: number | string,
  target: number | string
};

declare type D3ForceOptions = {
  height?: number,
  width?: number,
  data: {
    nodes: Array<D3Node>,
    links?: Array<D3Link>
  },
  getLinkId: (link: D3Link) => string | number,
  getNodeId: (node: D3Node) => string | number,
  alpha?: number,
  alphaDecay?: number,
  alphaMin?: number,
  alphaTarget?: number,
  velocityDecay?: number,
  forces?: D3Forces
};

declare module 'redux-d3-force' {
  declare module.exports: {
    D3ForceOptions: D3ForceOptions,
    D3Forces: D3Forces,
    D3Node: D3Node,
    D3Link: D3Link
  };
}
