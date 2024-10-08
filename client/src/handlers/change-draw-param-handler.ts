import toolState from "../store/tool.state";
import {ChangeDrawParamSocketData, ChangeDrawParamSocketType} from "../entities/socket";

export const changeDrawParamHandler = (data: ChangeDrawParamSocketData) => {
    switch (data.type) {
        case ChangeDrawParamSocketType.FillColor:
            const fillColor = document.querySelector('#fill-color') as HTMLInputElement;
            toolState.setFillColor(data.value);
            fillColor.value = data.value as string;
            break;
        case ChangeDrawParamSocketType.LineWidth:
            const lineWidth = document.querySelector('#line-width') as HTMLInputElement;
            toolState.setLineWidth(data.value);
            lineWidth.value = data.value;
            break;
        case ChangeDrawParamSocketType.StrokeColor:
            const strokeColor = document.querySelector('#stroke-color') as HTMLInputElement;
            toolState.setStrokeColor(data.value);
            strokeColor.value = data.value as string;
            break;
        case ChangeDrawParamSocketType.HasStroke:
            const hasStroke = document.querySelector('#has-stroke') as HTMLInputElement;
            toolState.setHasStroke(data.value);
            hasStroke.checked = data.value as boolean;
            break;
    }
}