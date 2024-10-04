import {makeAutoObservable} from "mobx";
import socketState from "./socket.state";
import {EventType} from "../entities/event";
import {SocketMessageData} from "../entities/socket";

class AppState {
    constructor() {
        makeAutoObservable(this);
    }

    public init() {
        this._listenDraw();
        this._listenUndoRedo();
        this._listenChangeDrawParam();
    }

    private _listenDraw() {
        document.addEventListener(EventType.Draw, (e: Event) => {
            const customEvent = e as CustomEvent<SocketMessageData>;
            socketState.send(customEvent.detail);
        });
    }

    private _listenUndoRedo() {
        document.addEventListener(EventType.UndoRedo, (e: Event) => {
            const customEvent = e as CustomEvent<SocketMessageData>;
            socketState.send(customEvent.detail);
        });
    }

    private _listenChangeDrawParam() {
        document.addEventListener(EventType.ChangeDrawParam, (e: Event) => {
            const customEvent = e as CustomEvent<SocketMessageData>;
            socketState.send(customEvent.detail);
        });
    }
}

const appState = new AppState();

export default appState;