import { createAction, createReducer } from 'redux-act';

const PREFIX = '@reduxForceGraph';
const createId = (id) => `${PREFIX}/${id}`;
const graphPayloadReducer = (graph, payload) => payload;
const createGraphAction = (id) => createAction(
  createId(id),
  graphPayloadReducer,
  (graph) => ({graph})
);
const createGraphItemAction = (id) => createAction(
  createId(id),
  graphPayloadReducer,
  (graph, item, getId = ((item) => item.id)) => ({graph, getId})
);

/*************************
 * Action Creators *
 *************************/

export const updateGraph = createGraphAction('UPDATE_GRAPH');

export const addNode = createGraphItemAction('ADD_NODE');
export const deleteNode = createGraphItemAction('DELETE_NODE');
export const updateNode = createGraphItemAction('UPDATE_NODE');

export const addLink= createGraphItemAction('ADD_LINK');
export const deleteLink = createGraphItemAction('DELETE_LINK');
export const updateLink = createGraphItemAction('UPDATE_LINK');

/************
 * Reducers *
 ************/

const addItem = (item, list = []) => [...list, item];
const removeItem = (item, list = [], getId) => list.filter(i => getId(i) !== getId(item));
const updateItem = (item, list = [], getId) => [...removeItem(item, list, getId), item];

const INITIAL_STATE = {graph: {}};

export default createReducer({
  [updateGraph]: (state, payload, {graph}) => ({
    ...state,
    graph: {
      ...state.graph,
      [graph]: {
        ...state.graph[graph],
        ...payload
      }
    }
  }),
  [addNode]: (state, node, {graph}) => ({
    ...state,
    graph: {
      ...state.graph,
      [graph]: {
        ...state.graph[graph],
        nodes: addItem(node, state.graph[graph].nodes),
      }
    }
  }),
  [deleteNode]: (state, node, {graph, getId}) => ({
    ...state,
    graph: {
      ...state.graph,
      [graph]: {
        ...state.graph[graph],
        nodes: removeItem(node, state.graph[graph].nodes, getId),
      }
    }
  }),
  [updateNode]: (state, node, {graph, getId}) => ({
    ...state,
    graph: {
      ...state.graph,
      [graph]: {
        ...state.graph[graph],
        nodes: updateItem(node, state.graph[graph].nodes, getId),
      }
    }
  }),
  [addLink]: (state, link, {graph}) => ({
    ...state,
    graph: {
      ...state.graph,
      [graph]: {
        ...state.graph[graph],
        links: addItem(link, state.graph[graph].links),
      }
    }
  }),
  [deleteLink]: (state, link, {graph, getId}) => ({
    ...state,
    graph: {
      ...state.graph,
      [graph]: {
        ...state.graph[graph],
        links: removeItem(link, state.graph[graph].links, getId),
      }
    }
  }),
  [updateLink]: (state, link, {graph, getId}) => ({
    ...state,
    graph: {
      ...state.graph,
      [graph]: {
        ...state.graph[graph],
        links: updateItem(link, state.graph[graph].links, getId),
      }
    }
  }),
}, INITIAL_STATE);
