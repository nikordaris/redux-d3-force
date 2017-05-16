// @flow
import React, { Component } from 'react';
import getDisplayName from './util/getDisplayName';

export default (options) => {
  return (WrappedComponent) => {
    class ForceGraph extends Component {
      static displayName = `Form(${getDisplayName(WrappedComponent)})`;
      static WrappedComponent = WrappedComponent;
      props: {
        destroyOnUnmount: boolean,
        graph: string
      };

      childContextTypes: {
        _reduxForm: {}
      };

      getChildContext() {
          return {
            _reduxForceGraph: {
              ...this.props,
            }
          }
        }
    }
  }
};
