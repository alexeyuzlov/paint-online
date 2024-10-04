import {BaseTool} from "./Tool";
import {ICircleDrawParams, IDrawData, ToolName} from "../entities/tool";
import toolState from "../store/tool.state";

export default class Circle extends BaseTool {
    private _mouseDown: boolean = false;

    private _savedImage: string = '';

    private _currCircle: ICircleDrawParams = {
        x: 0,
        y: 0,
        radius: 0,
        fillColor: '',
        strokeColor: '',
        lineWidth: 0,
        hasStroke: false
    };

    public draw(params: ICircleDrawParams): void {
        this.ctx.fillStyle = params.fillColor;
        this.ctx.strokeStyle = params.strokeColor;
        this.ctx.lineWidth = params.lineWidth;
        this.ctx.beginPath();
        this.ctx.arc(params.x, params.y, params.radius, 0, 2 * Math.PI);
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
        this._currCircle.x = e.pageX - target.offsetLeft;
        this._currCircle.y = e.pageY - target.offsetTop;
        this._currCircle.radius = 0;
        this._savedImage = canvasData;
    }

    protected handleMouseMove(e: MouseEvent): void {
        const target = e.target as HTMLElement;

        if (this._mouseDown) {
            const currentX =  e.pageX - target.offsetLeft;
            const currentY =  e.pageY - target.offsetTop;
            const width = currentX - this._currCircle.x;
            const height = currentY - this._currCircle.y;
            this._currCircle.radius = Math.sqrt(width**2 + height**2);
            this._showDrawing();
        }
    }

    protected handleMouseUp(): void {
        const circleParams: ICircleDrawParams = {
            x: this._currCircle.x,
            y: this._currCircle.y,
            radius: this._currCircle.radius,
            fillColor: this.ctx.fillStyle,
            strokeColor: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth,
            hasStroke: toolState.hasStroke
        };

        this._mouseDown = false;
        this.draw(circleParams);
        this.dispatchEvent(circleParams);
    }

    private _showDrawing() {
        const img = new Image();
        img.src = this._savedImage;
        img.onload = async () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.arc(this._currCircle.x, this._currCircle.y, this._currCircle.radius, 0, 2*Math.PI);
            this.ctx.fill();

            if (toolState.hasStroke) {
                this.ctx.stroke();
            }
        };
    }

    protected getDrawData(circleParams: ICircleDrawParams): IDrawData {
        return {
            type: ToolName.Circle,
            params: circleParams
        }
    }
}
