import React, { Component } from 'react';
import classnames from 'classnames';

export default class extends Component {
  static defaultProps = {
    cx: 0,
    cy: 0,
    labelStyle: {},
    labelClass: undefined,
    showLabel: false,
    opacity: 1,
    stroke: '#FFF',
    strokeWidth: 1.5,
    r: 5,
    className: undefined,
  }

  props: {
    node: NodeType,
    classes: {[string]: {}},
    cx?: number,
    cy?: number,
    labelStyle?: {},
    labelClass?: string,
    showLabel?: boolean,
    opacity?: number,
    stroke?: string,
    strokeWidth?: number,
    r: number,
    className?: string,
  }

  render() {
    const {
      node,
      classes,
      className,
      labelStyle,
      labelClass,
      showLabel,
      r,
      ...rest
    } = this.props;

    const { radius = r} = node;

    return (
      <circle
        className={classnames(classes.forceNode, className)}
        r={radius}
        {...rest}
      />
    );
  }
}
