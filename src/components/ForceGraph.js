// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sortBy, isEqual } from 'lodash';

import {
  initGraph,
  startSimulation,
  stopSimulation,
  isSimulationRunning
} from '../reducers';
import {
  getGraphNodes,
  getGraphLinks,
  shouldRunSimulation
} from '../selectors';
import {
  getNodeId as _getNodeId,
  getLinkId as _getLinkId,
  Simulation
} from '../d3-force';
import { getGraphState as _getGraphState } from '../utils';

export class ForceGraph extends Component {
  static defaultProps = {
    getNodeId: _getNodeId,
    getLinkId: _getLinkId,
    onSimulationStart: () => {},
    onSimulationStop: () => {},
    shouldRunSimulation: false,
    isSimulationRunning: false
  };

  props: {
    nodes: Array<any>,
    links: Array<any>,
    getNodeId: (node: any) => string,
    getLinkId: (link: any) => string,
    onSimulationStart: () => void,
    onSimulationStop: () => void,
    shouldRunSimulation: boolean,
    isSimulationRunning: boolean
  };

  simulation: Simulation;

  componentWillMount() {
    const options = {};
    this.simulation = new Simulation(options);
  }

  componentWillReceiveProps(props: any) {
    const { shouldRunSimulation, onSimulationStart, onSimulationStop } = props;
    if (shouldRunSimulation) {
      onSimulationStart();
      this.simulation.runSimulation().then(onSimulationStop);
    }
  }

  render() {
    const {
      shouldRunSimulation,
      onSimulationStart,
      onSimulationStop
    } = this.props;

    return <div />;
  }
}

export class ReduxForceGraph extends Component {
  static defaultProps = {
    getGraphState: _getGraphState,
    getNodeId: _getNodeId,
    getLinkId: _getLinkId,
    nodes: [],
    links: [],
    shouldRunSimulation: false,
    withRef: false
  };

  props: {
    graph: string,
    nodes: Array<any>,
    links: Array<any>,
    getGraphState: () => any,
    getNodeId: (node: any) => string,
    getLinkId: (link: any) => string,
    initGraph: (graph: string) => void,
    startSimulation: () => void,
    stopSimulation: () => void,
    shouldRunSimulation: boolean,
    isSimulationRunning: boolean,
    withRef: boolean
  };

  wrapped: any;

  componentWillReceiveProps(nextProps: { [string]: any }) {
    const { nodes, links, getNodeId, getLinkId } = this.props;
    const {
      nodes: nextNodes,
      links: nextLinks,
      getNodeId: nextGetNodeId,
      getLinkId: nextGetLinkId,
      initGraph,
      graph
    } = nextProps;

    const nodesSorted = sortBy(nodes, getNodeId);
    const linksSorted = sortBy(links, getLinkId);
    const nextNodesSorted = sortBy(nextNodes, nextGetNodeId);
    const nextLinksSorted = sortBy(nextLinks, nextGetLinkId);

    if (
      !isEqual(nodesSorted, nextNodesSorted) ||
      !isEqual(linksSorted, nextLinksSorted)
    ) {
      initGraph(graph, nextNodes, nextLinks);
    }
  }

  render() {
    const {
      getGraphState,
      graph,
      withRef,
      startSimulation,
      stopSimulation,
      ...rest
    } = this.props;
    const ConnectedForceGraph = connect(
      state => ({
        nodes: getGraphNodes(graph, getGraphState)(state),
        links: getGraphLinks(graph, getGraphState)(state)
      }),
      undefined,
      undefined,
      { withRef }
    )(ForceGraph);
    const attributes = { ...rest };
    if (withRef) {
      attributes.ref = (elm: any) => this.wrapped = elm;
    }
    return (
      <ConnectedForceGraph
        {...attributes}
        onSimulationStart={startSimulation}
        onSimulationStop={stopSimulation}
      />
    );
  }
}

export default class ConnectedReduxForceGraph extends Component {
  static defaultProps = {
    withRef: false
  };
  props: {
    withRef: boolean
  };

  wrapped: any;

  render() {
    const { withRef } = this.props;
    const WrappedComponent = connect(
      (state, { graph, getGraphState }) => ({
        shouldRunSimulation: shouldRunSimulation(graph, getGraphState)(state),
        isSimulationRunning: isSimulationRunning(graph, getGraphState)(state)
      }),
      (dispatch: Dispatch) =>
        bindActionCreators(
          {
            initGraph,
            startSimulation,
            stopSimulation
          },
          dispatch
        ),
      undefined,
      { withRef }
    )(ReduxForceGraph);

    const attributes = { ...this.props };
    if (withRef) {
      attributes.ref = (elm: any) => this.wrapped = elm;
    }

    return <WrappedComponent {...attributes} />;
  }
}
