declare type D3Forces = {
  [string]: {
    force?: () => any,
    options?: { [string]: any } | (options: D3ForceOptions) => { [string]: any }
  }
}

declare type D3ForceOptions = {
  height: number,
  width: number,
  alpha?: number,
  alphaDecay?: number,
  alphaMin?: number,
  velocityDecay?: number,
  forces?: D3Forces
}

declare module 'redux-d3-force' {
  declare module.exports: {
    D3ForceOptions: D3ForceOptions,
      D3Forces: D3Forces
  }
}