import {makeAutoObservable} from "mobx";
import authState from "./auth.state";
import {SocketEvent, SocketMessage, SocketMessageData} from "../entities/socket";
import {drawHandler} from "../handlers/draw-handler";
import {undoRedoHandler} from "../handlers/undo-redo-handler";
import canvasState from "./canvas.state";
import {changeDrawParamHandler} from "../handlers/change-draw-param-handler";
import {API_URL} from "../entities/server";

class SocketState {
    private _socket: WebSocket | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    public connect() {
        const socket = new WebSocket(API_URL);
        this._socket = socket;
        this._listenOpenEvent(socket);
        this._listenMessageEvent();
    }

    public send(message: SocketMessageData) {
        if (!this._socket) {
            return;
        }

        const messageBody: SocketMessage = {
            ...message,
            username: authState.getUsername,
            id: authState.getSessionId
        };

        try {
            this._socket.send(JSON.stringify(messageBody));
        } catch (e) {
            console.error(e);
        }
    }

    private _listenOpenEvent(socket: WebSocket) {
        socket.onopen = () => {
            socket.send(JSON.stringify({
                id: authState.getSessionId,
                username: authState.getUsername,
                method: SocketEvent.Connection
            }));
        }
    }

    private _listenMessageEvent() {
        if (!this._socket) {
            return;
        }

        this._socket.onmessage = (event) => {
            const message: SocketMessage = JSON.parse(event.data);

            if (message.username === authState.getUsername) {
                return;
            }

            switch (message.method) {
                case SocketEvent.Connection:
                    console.log(`пользователь ${message.username} присоединился`)
                    break;
                case SocketEvent.Draw:
                    drawHandler(message.data);
                    break;
                case SocketEvent.Do:
                    undoRedoHandler(message.data, canvasState.getCanvasRef!);
                    break;
                case SocketEvent.ChangeDrawParam:
                    changeDrawParamHandler(message.data);
                    break;
            }
        }
    }
}

const socketState = new SocketState();

export default socketState;