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

export const DEFAULT_FORCE_OPTIONS = {
  charge: {
    force: forceManyBody
  },
  center: {
    force: forceCenter,
    options: (opt: { height: number, width: number }) => ({
      x: opt.width / 2,
      y: opt.height / 2
    })
  },
  collide: {
    force: forceCollide,
    options: {
      radius: (node: { radius: number }) => node.radius + 3
    }
  },
  link: {
    force: forceLink,
    options: {
      id: getLinkId
    }
  }
}

function thunk(thunk, args) {
  return isFunction(thunk) ? thunk(args) : thunk;
}

function _applyForces(simulation: any, forces: D3Forces, options: D3ForceOptions) {
  return reduce(forces, (changed, { force, options: forceOptions }, name) => {
    if (!simulation.force(name)) {
      simulation.force(name, force);
    }

    return !simulation.force(name) && reduce(thunk(forceOptions, options), (changedInner, value, prop) => {
      if (!isEqual(simulation.force(name)[prop](), value)) {
        simulation.force(name)[prop](value);
        return true;
      }
      return changedInner;
    }, changed);
  }, false);
}

export class Simulation {
  simulation: any;

  constructor(options: D3ForceOptions) {
    this.simulation = forceSimulation();
    this.simulation.strength = {};
  }

  applyForces(options: D3ForceOptions) {
    const { forces = {} } = options;
    const defaultChanged = _applyForces(this.simulation, DEFAULT_FORCE_OPTIONS);
    const forcesChanged = _applyForces(this.simulation, forces);
    return defaultChanged || forcesChanged;
  }

  updateCenterForce(options: D3ForceOptions) {
    if (!this.simulation.force('center')) {
      this.simulation.force('center', forceCenter());
    }

    const { height = 0, width = 0 } = options;
    const centerOptions = get(options, 'forces.center', { x: width / 2, y: height / 2 });
    let changed = false;
    if (this.simulation.force('center').x() !== centerOptions.x) {
      changed = true;
      this.simulation.force('center').x(centerOptions.x);
    }

    if (this.simulation.force('center').y() !== centerOptions.y) {
      changed = true;
      this.simulation.force('center').y(centerOptions.y);
    }

    return changed;
  }

  updateChargeForce(options: D3ForceOptions = {}) {
    const chargeOptions = get(options, 'forces.charge', { force: forceManyBody() });
    if (!this.simulation.force('charge')) {
      this.simulation.force('charge', chargeOptions.force);
    }

  }

  setCollisionForce(options: D3ForceOptions) { }

  setLinkForce(options: D3ForceOptions) { }

  setAxisForce(options: D3ForceOptions) { }

  updateSimulation(options: D3ForceOptions = {}) {
    ALPHA_OPTIONS.forEach(
      prop => options[prop] && this.simulation[prop](options[prop])
    );
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
