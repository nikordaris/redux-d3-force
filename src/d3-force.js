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

export class Simulation {
  simulation: any;
  shouldRun: boolean;

  constructor(options) {
    this.simulation = forceSimulation();
    this.simulation.strength = {};
  }

  setCenterForce(options: any = {}) {}

  setManyBodyChargeForce(options: any = {}) {}

  setCollisionForce(options: any = {}) {}

  setLinkForce(options: any = {}) {}

  setAxisForce(options: any = {}) {}

  updateSimulation(options: any = {}) {
    ALPHA_OPTIONS.forEach(
      alpha => options[alpha] && this.simulation[alpha](options[alpha])
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
