// @flow
import React, { Component } from 'react';
import classnames from 'classnames';

export type LinkType = {
  source: string,
  target: string,
  value?: number
}

export default class extends Component {
  static defaultProps = {
    opacity: 0.6,
    stroke: '#999',
    strokeWidth: undefined
  }
  props: {
    link: LinkType,
    opacity?: number,
    stroke?: string,
    strokeWidth?: string,
    classes: {[string]: any}
  }
  render() {
    const {
      link,
      strokeWidth = Math.sqrt(link.value),
      classes,
      className,
      ...rest
    } = this.props;
    return <line classname={classnames(classes.forceLink, className)} strokeWidth={strokeWidth} {...rest} />
  }
}
