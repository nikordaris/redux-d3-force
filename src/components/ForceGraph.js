// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sortBy } from 'lodash';
import { diff } from 'deep-diff';

import { initGraph } from '../reducers';
import { getGraphNodes, getGraphLinks } from '../selectors';
import { getNodeId as _getNodeId, getLinkId as _getLinkId } from '../d3-force';
import { getGraphState as _getGraphState } from '../utils';

class ForceGraph extends Component {
  render() {
    return <div />;
  }
}

@connect(
  state => ({}),
  dispatch =>
    bindActionCreators(
      {
        initGraph
      },
      dispatch
    )
)
export default class ReduxForceGraph extends Component {
  static defaultProps = {
    getGraphState: _getGraphState,
    getNodeId: _getNodeId,
    getLinkId: _getLinkId,
    nodes: [],
    links: []
  };

  props: {
    graph: string,
    nodes: [],
    links: [],
    getGraphState?: () => void,
    getNodeId?: () => void,
    getLinkId?: () => void,
    initGraph: () => void
  };

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
      diff(nodesSorted, nextNodesSorted) || diff(linksSorted, nextLinksSorted)
    ) {
      initGraph(graph, nextNodes, nextLinks);
    }
  }

  render() {
    const { getGraphState, graph, ...rest } = this.props;
    const ConnectedForceGraph = connect(state => ({
      nodes: getGraphNodes(graph, getGraphState)(state),
      links: getGraphLinks(graph, getGraphState)(state)
    }))(ForceGraph);
    return <ConnectedForceGraph {...rest} />;
  }
}
