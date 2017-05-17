import React, { Component } from 'react';
import { connect } from 'react-redux';

import {getGraphNodes, getGraphLinks} from '../selectors';
import { getNodeId as _getNodeId, getLinkId as _getLinkId } from '../d3-force';
import { getGraphState as _getGraphState } from '../utils';

class ForceGraph extends Component {

  render() {
    return (
      <div/>
    )
  }
}

export default class ReduxForceGraph extends Component {
  static defaultProps = {
    getGraphState: _getGraphState,
    getNodeId: _getNodeId,
    getLinkId: _getLinkId,
  };

  props: {
    graphName: string,
    getGraphState?: () => void,
    getNodeId?: () => void,
    getLinkId?: () => void,
  };

  render() {
    const { getGraphState, getNodeId, getLinkId } = this.props;
    const ConnectedForceGraph = connect(state => ({nodes: getGraphState(state)}))(ForceGraph);
    return (
      <ConnectedForceGraph {...this.props}/>
    )
  }
}
