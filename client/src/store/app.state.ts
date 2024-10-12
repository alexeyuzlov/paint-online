import {makeAutoObservable} from "mobx";
import socketState from "./socket.state";
import {EventType} from "../entities/event";
import {SocketMessageData} from "../entities/socket";

// document.addEventListener - когда есть свой стейт, то это костыль. Лучше придерживаться mobx
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
            // да, здесь определенно нарушение уровней ответственности по коду, т.к. ты делаешь низкоровневые операции (составление событий) вместе с высокоровневыми (отправка сообщений)
            // здесь поможет socket.io и вся эта логика может находиться сразу в socket.state.ts
            // этот класс AppState лишний
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