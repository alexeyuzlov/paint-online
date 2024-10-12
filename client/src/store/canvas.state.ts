import {makeAutoObservable} from "mobx";
import authState from "./auth.state";

// я не уверен хорошо ли так делать в принципе - хранить в стейте ссылку на DOM элемент
// корректнее хранить данные, но это будет сложнее
class CanvasState {
    private _canvasRef: HTMLCanvasElement | null = null;

    get getCanvasRef() {
        return this._canvasRef;
    }

    get canvasDataUrl() {
        return this._canvasRef?.toDataURL();
    }

    constructor() {
        makeAutoObservable(this)
    }

    public setCanvas(canvas: HTMLCanvasElement) {
        this._canvasRef = canvas;
    }

    public download() {
        const dataUrl = this.canvasDataUrl;
        const a = document.createElement('a');

        if (!dataUrl) {
            return;
        }

        a.href = dataUrl;
        a.download = authState.getSessionId + ".jpg";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

const canvasState = new CanvasState();

export default canvasState;
