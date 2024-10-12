import toolState from "../store/tool.state";
import {ChangeDrawParamSocketData, ChangeDrawParamSocketType} from "../entities/socket";

// лучше переписать хешем, вместо switch и сохранить за пределами этой функции и дергать в этой функции нужный ключ
export const changeDrawParamHandler = (data: ChangeDrawParamSocketData) => {
    switch (data.type) {
        case ChangeDrawParamSocketType.FillColor:
            // не, так нельзя, в данном случае этому коду место около toolState
            // пришлось обратиться к DOM, т.к. ты не хранишь данные в стейте, а на самом деле надо
            // я обратил вниманние что в ToolBar.tsx ты как раз в input не делаешь value={здесь из стейта значение}
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