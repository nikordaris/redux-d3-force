// @flow
import { get, reduce, forEach, isFunction, isEqual } from 'lodash';

import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY
} from 'd3-force';

export function getNodeId(node: any) {
  return node.id;
}

export function getLinkId(link: any) {
  return `${link.source.id || link.source}=>${link.target.id || link.target}`;
}

const ALPHA_OPTIONS = [
  'alpha',
  'alphaDecay',
  'alphaMin',
  'alphaTarget',
  'velocityDecay'
];

export const DEFAULT_FORCE_OPTIONS: D3Forces = {
  charge: {
    force: forceManyBody
  },
  center: {
    force: forceCenter,
    options: ({ height = 0, width = 0 }: D3ForceOptions) => ({
      x: width / 2,
      y: height / 2
    })
  },
  collide: {
    force: forceCollide,
    options: {
      radius: ({ radius }: D3Node) => radius + 3
    }
  },
  link: {
    force: forceLink,
    options: ({
      getLinkId: _getLinkId = getLinkId,
      data: { links }
    }: D3ForceOptions) => ({
      id: _getLinkId,
      links
    })
  },
  x: {
    force: forceX
  },
  y: {
    force: forceY
  }
};

function thunk(thunk, args) {
  return isFunction(thunk) ? thunk(args) : thunk;
}

export class Simulation {
  simulation: any;

  constructor(options: D3ForceOptions) {
    this.simulation = forceSimulation();
    this.simulation.strength = {};
  }

  applyForces(options: D3ForceOptions) {
    const { forces = {} } = options;
    return reduce(
      { ...DEFAULT_FORCE_OPTIONS, ...forces },
      (changed, { force, options: forceOptions }, name) => {
        if (!this.simulation.force(name)) {
          this.simulation.force(name, force);
        }

        return (
          this.simulation.force(name) &&
          forceOptions &&
          reduce(
            thunk(forceOptions, options),
            (changedInner, value, prop) => {
              if (!isEqual(this.simulation.force(name)[prop](), value)) {
                this.simulation.force(name)[prop](value);
                return true;
              }
              return changedInner;
            },
            changed
          )
        );
      },
      false
    );
  }

  updateSimulation(options: D3ForceOptions) {
    const {
      data: { nodes = [] } = { nodes: [] },
      getNodeId: _getNodeId = getNodeId
    } = options;
    ALPHA_OPTIONS.forEach(
      prop => options[prop] && this.simulation[prop](options[prop])
    );
    if (
      !isEqual(
        this.simulation.nodes.map(_getNodeId).sort(),
        nodes.map(_getNodeId).sort()
      )
    ) {
      this.simulation.nodes(nodes);
    }
    this.applyForces(options);
  }

  runSimulation() {
    return new Promise((resolve, error) => {
      this.simulation.restart();

      while (this.simulation.alpha() > this.simulation.alphaMin()) {
        this.simulation.tick();
      }

      this.simulation.stop();
      resolve();
    });
  }
}
