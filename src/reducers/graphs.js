import { createAction, createReducer } from 'redux-act';
import { actionCreatorId } from '../utils';

const graphPayloadReducer = (graph, payload) => payload;
const createGraphAction = (
  id,
  payloadReducer = graphPayloadReducer,
  metaReducer = graph => ({ graph })
) => createAction(actionCreatorId(id), payloadReducer, metaReducer);
const createGraphItemAction = id =>
  createAction(
    actionCreatorId(id),
    graphPayloadReducer,
    (graph, item, getId = item => item.id) => ({ graph, getId })
  );
const updateGraphState = (state, graph, payload) => ({
  ...state,
  [graph]: {
    ...state[graph],
    ...payload
  }
});

/*************************
 * Action Creators *
 *************************/

export const initGraph = createGraphAction(
  'INIT_GRAPH',
  (graph, nodes, links) => ({
    nodes,
    links,
    initialNodes: nodes,
    initialLinks: links,
    runSimulation: true
  })
);

export const updateGraph = createGraphAction('UPDATE_GRAPH');

export const addNode = createGraphItemAction('ADD_NODE');
export const deleteNode = createGraphItemAction('DELETE_NODE');
export const updateNode = createGraphItemAction('UPDATE_NODE');

export const addLink = createGraphItemAction('ADD_LINK');
export const deleteLink = createGraphItemAction('DELETE_LINK');
export const updateLink = createGraphItemAction('UPDATE_LINK');

export const startSimulation = createGraphAction('START_SIMULATION');
export const stopSimulation = createGraphAction('STOP_SIMULATION');

/************
 * Reducers *
 ************/

const addItem = (item, list = []) => [...list, item];
const removeItem = (item, list = [], getId) =>
  list.filter(i => getId(i) !== getId(item));
const updateItem = (item, list = [], getId) => [
  ...removeItem(item, list, getId),
  item
];

const INITIAL_STATE = {};

export default createReducer(
  {
    [initGraph]: (state, payload, { graph }) =>
      updateGraphState(state, graph, payload),
    [startSimulation]: (state, payload, { graph }) =>
      updateGraphState(state, graph, {
        simulationRunning: true,
        runSimulation: false
      }),
    [stopSimulation]: (state, payload, { graph }) =>
      updateGraphState(state, graph, {
        simulationRunning: false
      }),
    [updateGraph]: (state, payload, { graph }) =>
      updateGraphState(state, graph, {
        ...payload,
        // Prevent overwriting initial nodes & links
        initialNodes: state[graph].initialNodes,
        initialLinks: state[graph].initialLinks
      }),
    [addNode]: (state, node, { graph }) =>
      updateGraphState(state, graph, {
        nodes: addItem(node, state[graph].nodes)
      }),
    [deleteNode]: (state, node, { graph, getId }) =>
      updateGraphState(state, graph, {
        nodes: removeItem(node, state[graph].nodes, getId)
      }),
    [updateNode]: (state, node, { graph, getId }) =>
      updateGraphState(state, graph, {
        nodes: updateItem(node, state[graph].nodes, getId)
      }),
    [addLink]: (state, link, { graph }) =>
      updateGraphState(state, graph, {
        links: addItem(link, state[graph].links)
      }),
    [deleteLink]: (state, link, { graph, getId }) =>
      updateGraphState(state, graph, {
        links: removeItem(link, state.graph[graph].links, getId)
      }),
    [updateLink]: (state, link, { graph, getId }) =>
      updateGraphState(state, graph, {
        links: updateItem(link, state[graph].links, getId)
      })
  },
  INITIAL_STATE
);
