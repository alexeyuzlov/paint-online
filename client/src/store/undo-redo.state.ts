import {makeAutoObservable} from "mobx";
import {setImageHandler} from "../handlers/set-image-handler";
import {SocketEvent, SocketMessageData, UndoRedoSocketData, UndoRedoSocketMethod} from "../entities/socket";
import {EventType} from "../entities/event";

// здесь происходит нарушение зоны ответственности, т.к. мы храним все данные на сервере, соответственно
// эта фича уместнее там - нам надо рассылать всем кто подключен, что кто-то что-то сделал
class UndoRedoState {
    public canvas!: HTMLCanvasElement;

    public undoList: string[] = [];

    public redoList: string[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    public init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public pushToUndo(imgUrl: string) {
        this.undoList.push(imgUrl);
        this.redoList = [];
        this._dispatchUndoRedoEvent(this._generateUndoRedoMessage(UndoRedoSocketMethod.PushUndo));
    }

    public undo() {
        this._actionHandler(this.undoList, this.redoList, UndoRedoSocketMethod.Undo);
    }

    public redo() {
        this._actionHandler(this.redoList, this.undoList, UndoRedoSocketMethod.Redo);
    }

    private _actionHandler(sourceList: string[], targetList: string[], actionType: UndoRedoSocketMethod) {
        if (sourceList.length > 0) {
            const imgUrl = sourceList.pop()!;
            // Вопрос, вот тут лучше через стейт или как сейчас?
            targetList.push(this.canvas.toDataURL());

            setImageHandler(this.canvas, imgUrl).then(() =>
                this._dispatchUndoRedoEvent(
                    this._generateUndoRedoMessage(actionType, imgUrl)
                ));
        }
    }

    private _dispatchUndoRedoEvent(message: SocketMessageData) {
        const drawEvent = new CustomEvent(
            EventType.UndoRedo,
            {detail: message}
        );
        document.dispatchEvent(drawEvent);
    }

    private _generateUndoRedoMessage(method: UndoRedoSocketMethod, dataUrl?: string): SocketMessageData {
        let messageData: UndoRedoSocketData = {
            undo: this.undoList,
            redo: this.redoList,
            method
        };

        if (dataUrl) {
            messageData = {
                ...messageData,
                dataUrl
            };
        }

        return {
            method: SocketEvent.Do,
            data: messageData
        };
    }
}

const undoRedoState = new UndoRedoState();

export default undoRedoState;