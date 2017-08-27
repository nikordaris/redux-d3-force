import { get } from "lodash";

const _getForceGraphState = state => get(state, 'forceGraph');

export const getGraphNodes = (
  graph,
  getForceGraphState = _getForceGraphState
) => state => get(getForceGraphState(state), `graphs.${graph}.nodes`);

export const getGraphLinks = (
  graph,
  getForceGraphState = _getForceGraphState
) => state => get(getForceGraphState(state), `graphs.${graph}.links`);

export const getGraphInitialNodes = (
  graph,
  getForceGraphState = _getForceGraphState
) => state => get(getForceGraphState(state), `graphs.${graph}.initialNodes`);

export const getGraphInitialLinks = (
  graph,
  getForceGraphState = _getForceGraphState
) => state => get(getForceGraphState(state), `graphs.${graph}.initialLinks`);

export const isSimulationRunning = (
  graph,
  getForceGraphState = _getForceGraphState
) => state =>
  get(getForceGraphState(state), `graphs.${graph}.simulationRunning`);

export const shouldRunSimulation = (
  graph,
  getForceGraphState = _getForceGraphState
) => state => get(getForceGraphState(state), `graphs.${graph}.runSimulation`);
