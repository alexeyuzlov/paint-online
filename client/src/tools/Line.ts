import {BaseTool} from "./Tool";
import {IDrawData, ILineDrawParams, ToolName} from "../entities/tool";

export default class Line extends BaseTool {
    private _mouseDown: boolean = false;

    private _savedImage: string = '';

    private _currLine: ILineDrawParams = {
        x: 0,
        y: 0,
        endX: 0,
        endY: 0,
        strokeColor: '',
        lineWidth: 0
    };

    public draw(params: ILineDrawParams): void {
        this.ctx.strokeStyle = params.strokeColor;
        this.ctx.lineWidth = params.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(params.x, params.y);
        this.ctx.lineTo(params.endX, params.endY);
        this.ctx.stroke();
    }

    protected handleMouseMove(e: MouseEvent): void {
        const target = e.target as HTMLElement;

        if (this._mouseDown) {
            this._showDrawing(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
        }
    }

    protected handleMouseDown(e: MouseEvent): void {
        const canvasData = this.canvas.toDataURL();
        const target = e.target as HTMLElement;

        this._mouseDown = true;
        this._currLine.x = e.pageX - target.offsetLeft;
        this._currLine.y = e.pageY - target.offsetTop;
        this.ctx.beginPath();
        this.ctx.moveTo(this._currLine.x, this._currLine.y);
        this._savedImage = canvasData;
    }

    protected handleMouseUp(e:MouseEvent): void {
        const target = e.target as HTMLElement;
        const lineParams: ILineDrawParams = {
            x: this._currLine.x,
            y: this._currLine.y,
            endX: e.pageX - target.offsetLeft,
            endY: e.pageY - target.offsetTop,
            strokeColor: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth
        };

        this._mouseDown = false;
        this.draw(lineParams);
        this.dispatchEvent(lineParams);
    }

    private _showDrawing(x: number, y: number): void {
        const img = new Image();
        img.src = this._savedImage;
        img.onload = async () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.moveTo(this._currLine.x, this._currLine.y);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        };
    }

    protected getDrawData(lineParams: ILineDrawParams): IDrawData {
        return {
            type: ToolName.Line,
            params: lineParams
        }
    }
}
