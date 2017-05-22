import { get } from "lodash";

export const actionCreatorId = id => `@forceGraph/${id}`;

export const getDisplayName = Comp =>
  Comp.displayName || Comp.name || "Component";

export const getGraphState = state => get(state, "forceGraph");
