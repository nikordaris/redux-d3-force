// @flow
import React, { Component } from "react";
import { getDisplayName } from "./utils";

export default (options: {}) => {
  return (WrappedComponent: Component<*, *, *>) => {
    class ForceGraph extends Component {
      static displayName = `ForceGraph(${getDisplayName(WrappedComponent)})`;
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
            ...this.props
          }
        };
      }
    }
  };
};
