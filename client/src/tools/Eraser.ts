import Brush from "./Brush";
import {IBrushParams} from "../entities/tool";

export default class Eraser extends Brush {
    private _savedStrokeColor: string | CanvasGradient | CanvasPattern = '';

    public override draw(params: IBrushParams) {
        if (!params.isFinish) {
            if (this.firstTouch) {
                this.ctx.beginPath();
                this.firstTouch = false;
                this._savedStrokeColor = params.brushParams!.strokeColor;
            }

            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = params.brushParams!.lineWidth;
            this.ctx.lineTo(params.brushParams!.x, params.brushParams!.y);
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.firstTouch = true;
            this.ctx.strokeStyle = this._savedStrokeColor;
        }
    }
}
