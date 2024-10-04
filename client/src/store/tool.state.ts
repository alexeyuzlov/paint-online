import {makeAutoObservable} from "mobx";
import {Tool, ToolName} from "../entities/tool";
import {defaultToolsSet} from "../entities/tools-set";
import Brush from "../tools/Brush";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import Rect from "../tools/Rect";
import {
    ChangeDrawParamSocketType,
    SocketEvent,
    SocketMessageData
} from "../entities/socket";
import {EventType} from "../entities/event";

class ToolState {
    public toolsSet = defaultToolsSet;

    public currentTool: Tool | null = null;

    public currentToolName: ToolName | null = null;

    private _hasStroke = false;

    private _canvasRef: HTMLCanvasElement | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    public get hasStroke() {
        return this._hasStroke;
    }

    public init(canvasRef: HTMLCanvasElement) {
        this._canvasRef = canvasRef;
        this.setTool(ToolName.Brush);
    }

    public setTool(toolName: ToolName) {
        const tool = this.getTool(toolName);

        if (this.currentTool) {
            this.currentTool.destroy();
        }

        this.currentTool = tool;
        this.currentToolName = toolName;
        this.currentTool!.listen();
    }

    public getTool(toolName: ToolName): Tool | null {
        if (!this._canvasRef) {
            return null;
        }

        if (this.toolsSet[toolName] === null) {
            switch (toolName) {
                case ToolName.Brush:
                    this.toolsSet[toolName] = new Brush(this._canvasRef);
                    break;
                case ToolName.Circle:
                    this.toolsSet[toolName] = new Circle(this._canvasRef);
                    break;
                case ToolName.Eraser:
                    this.toolsSet[toolName] = new Eraser(this._canvasRef);
                    break;
                case ToolName.Line:
                    this.toolsSet[toolName] = new Line(this._canvasRef);
                    break;
                case ToolName.Rect:
                    this.toolsSet[toolName] = new Rect(this._canvasRef);
                    break;
            }
        }

        return this.toolsSet[toolName]!;
    }

    public setFillColor(color: string | CanvasGradient | CanvasPattern, shouldSendBySocket = false) {
        this.currentTool!.fillColor = color;

        if (shouldSendBySocket) {
            this._dispatchEvent(ChangeDrawParamSocketType.FillColor, color);
        }
    }

    public setStrokeColor(color: string | CanvasGradient | CanvasPattern, shouldSendBySocket = false) {
        this.currentTool!.strokeColor = color;

        if (shouldSendBySocket) {
            this._dispatchEvent(ChangeDrawParamSocketType.StrokeColor, color);
        }
    }

    public setLineWidth(width: number, shouldSendBySocket = false) {
        this.currentTool!.lineWidth = width;

        if (shouldSendBySocket) {
            this._dispatchEvent(ChangeDrawParamSocketType.LineWidth, width);
        }
    }

    public setHasStroke(hasStroke: boolean, shouldSendBySocket = false) {
        this._hasStroke = hasStroke;

        if (shouldSendBySocket) {
            this._dispatchEvent(ChangeDrawParamSocketType.HasStroke, hasStroke);
        }
    }

    private _generateMessage(type: ChangeDrawParamSocketType, value: any): SocketMessageData {
        return {
            method: SocketEvent.ChangeDrawParam,
            data: {
                type,
                value
            }
        }
    }

    private _dispatchEvent(type: ChangeDrawParamSocketType, value: any) {
        const message = this._generateMessage(type, value);
        const drawEvent = new CustomEvent(
            EventType.ChangeDrawParam,
            {detail: message}
        );
        document.dispatchEvent(drawEvent);
    }
}

const toolState = new ToolState();

export default toolState;
