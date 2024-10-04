import {Tool} from "./tool";

export interface ToolsSet {
    brush: Tool|null;
    rect: Tool|null;
    circle: Tool|null;
    eraser: Tool|null;
    line: Tool|null;
}

export const defaultToolsSet: ToolsSet = {
    brush: null,
    rect: null,
    circle: null,
    eraser: null,
    line: null,
};
