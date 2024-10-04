import {BaseTool} from "./Tool";
import {IDrawData, ToolName} from "../entities/tool";
import {IBrushParams} from "../entities/tool";

export default class Brush extends BaseTool {
    // Necessary to prevent drawing a line from the previous instrument towards a new curve made by Brush
    // Happens when another user gets message by sockets, because they don't have this.ctx.beginPath();
    protected firstTouch = true;

    private _mouseDown: boolean = false;

    public draw(params: IBrushParams) {
        if (!params.isFinish) {
            if (this.firstTouch) {
                this.ctx.beginPath();
                this.firstTouch = false;
            }

            this.ctx.strokeStyle = params.brushParams!.strokeColor;
            this.ctx.lineWidth = params.brushParams!.lineWidth;
            this.ctx.lineTo(params.brushParams!.x, params.brushParams!.y);
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.firstTouch = true;
        }
    }

    protected handleMouseDown(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const xInsideCanvas = e.pageX - target.offsetLeft;
        const yInsideCanvas = e.pageY - target.offsetTop;

        this._mouseDown = true;

        this.ctx.beginPath();
        this.ctx.moveTo(xInsideCanvas, yInsideCanvas);
    }

    protected handleMouseMove(e: MouseEvent) {
        const target = e.target as HTMLElement;

        if (this._mouseDown) {
            const brushParams: IBrushParams = {
                brushParams: {
                    x: e.pageX - target.offsetLeft,
                    y: e.pageY - target.offsetTop,
                    strokeColor: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth,
                },
                isFinish: false
            };

            this.draw(brushParams);
            this.dispatchEvent(brushParams);
        }
    }

    protected handleMouseUp() {
        const brushParams: IBrushParams = {
            isFinish: true
        };

        this._mouseDown = false;
        this.draw(brushParams);
        this.dispatchEvent(brushParams);
    }

    protected getDrawData(brushParams: IBrushParams): IDrawData {
        return {
            type: ToolName.Brush,
            params: brushParams
        }
    }
}

