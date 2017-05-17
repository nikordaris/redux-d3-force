import { get } from 'lodash';

export const getDisplayName = (Comp) => Comp.displayName || Comp.name || 'Component';

export const getGraphState = (state) => get(state, 'forceGraph');
