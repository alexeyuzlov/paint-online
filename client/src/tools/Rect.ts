import {BaseTool} from "./Tool";
import {IDrawData, IRectDrawParams, ToolName} from "../entities/tool";
import toolState from "../store/tool.state";

export default class Rect extends BaseTool {
    private _mouseDown: boolean = false;

    private _savedImage: string = '';

    private _currRect: IRectDrawParams = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fillColor: '',
        strokeColor: '',
        lineWidth: 0,
        hasStroke: false
    };

    public draw(params: IRectDrawParams): void {
        this.ctx.lineWidth = params.lineWidth;
        this.ctx.fillStyle = params.fillColor;
        this.ctx.strokeStyle = params.strokeColor;
        this.ctx.beginPath();
        this.ctx.rect(params.x, params.y, params.width, params.height);
        this.ctx.fill();

        if (params.hasStroke) {
            this.ctx.stroke();
            toolState.setHasStroke(true);
        }
    }

    protected handleMouseDown(e: MouseEvent): void {
        const canvasData = this.canvas.toDataURL();
        const target = e.target as HTMLElement;

        this._mouseDown = true;
        this.ctx.beginPath();
        this._currRect.x = e.pageX - target.offsetLeft;
        this._currRect.y = e.pageY - target.offsetTop;
        this._savedImage = canvasData;
    }

    protected handleMouseMove(e: MouseEvent): void {
        const target = e.target as HTMLElement;

        if (this._mouseDown) {
            const currentX = e.pageX - target.offsetLeft;
            const currentY = e.pageY - target.offsetTop;
            this._currRect.width = currentX - this._currRect.x;
            this._currRect.height = currentY - this._currRect.y;
            this._showDrawing();
        }
    }

    protected handleMouseUp(): void {
        const rectParams: IRectDrawParams = {
            x: this._currRect.x,
            y: this._currRect.y,
            width: this._currRect.width,
            height: this._currRect.height,
            fillColor: this.ctx.fillStyle,
            strokeColor: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth,
            hasStroke: toolState.hasStroke
        };

        this._mouseDown = false;
        this.draw(rectParams);
        this.dispatchEvent(rectParams);
    }

    private _showDrawing() {
        const img = new Image();
        img.src = this._savedImage;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.rect(this._currRect.x, this._currRect.y, this._currRect.width, this._currRect.height);
            this.ctx.fill();

            if (toolState.hasStroke) {
                this.ctx.stroke();
            }
        };
    }

    protected getDrawData(rectParams: IRectDrawParams): IDrawData {
        return {
            type: ToolName.Rect,
            params: rectParams
        }
    }
}
