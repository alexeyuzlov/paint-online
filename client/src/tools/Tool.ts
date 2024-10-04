import {IBaseToolParams, IDrawData} from "../entities/tool";
import {SocketEvent, SocketMessageData} from "../entities/socket";
import {EventType} from "../entities/event";

export abstract class BaseTool implements IBaseToolParams {
    protected canvas: HTMLCanvasElement;

    protected ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    public set fillColor(color: string | CanvasGradient | CanvasPattern) {
        this.ctx.fillStyle = color;
    }

    public set strokeColor(color: string | CanvasGradient | CanvasPattern) {
        this.ctx.strokeStyle = color;
    }

    public set lineWidth(width: number) {
        this.ctx.lineWidth = width;
    }

    public destroy() {
        this.canvas.onmousemove = null;
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
    }

    public listen() {
        this.canvas.onmousemove = this.handleMouseMove.bind(this);
        this.canvas.onmousedown = this.handleMouseDown.bind(this);
        this.canvas.onmouseup = this.handleMouseUp.bind(this);
    }

    public abstract draw(params: any): void;

    protected abstract handleMouseDown(e: MouseEvent): void;

    protected abstract handleMouseMove(e: MouseEvent): void;

    protected abstract handleMouseUp(e: MouseEvent): void;

    protected abstract getDrawData(params: any): IDrawData;

    protected dispatchEvent(params: any) {
        const drawData = this.getDrawData(params);
        const message: SocketMessageData = {
            method: SocketEvent.Draw,
            data: drawData
        };
        const drawEvent = new CustomEvent(
            EventType.Draw,
            {detail: message}
        );

        document.dispatchEvent(drawEvent);
    }
}
