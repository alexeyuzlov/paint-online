import toolState from "../store/tool.state";
import {IDrawData} from "../entities/tool";

export const drawHandler = (drawData: IDrawData) => {
    const tool = toolState.getTool(drawData.type);

    if (tool) {
        tool.draw(drawData.params);
    }
};
