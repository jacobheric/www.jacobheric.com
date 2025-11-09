import { createDefine } from "fresh";

export interface State {
  title?: string;
  description?: string;
  noIndex?: boolean;
  script?: string;
}

export const define = createDefine<State>();
