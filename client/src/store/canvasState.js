import {makeAutoObservable} from "mobx";

// canvasState -> appState очень вероятно, сейчас он выполняет много лишних обязаностей
class CanvasState {
    canvas = null
    socket = null
    sessionid = null
    undoList = []
    redoList = []
    username = "default"

    constructor() {
        makeAutoObservable(this)
    }

    // сокеты здесь лишние, это отдельный стейт
    setSessionId(id) {
        this.sessionid = id
    }

    setSocket(socket) {
        this.socket = socket
    }

    setUsername(username) {
        this.username = username
    }

    setCanvas(canvas) {
        this.canvas = canvas
    }

    pushToUndo(data) {
        this.undoList.push(data)
    }

    pushToRedo(data) {
        this.redoList.push(data)
    }

    // undo + redo Это свой независимый стейт, который используется через композицию
    // также эта фича ничего не может знать о сокетах, корректнее вытащить сокеты в свой стейт,
    // а undo/redo сделать тоже отдельным стейтом и обмениваться событиями
    undo() {
        let ctx = this.canvas.getContext('2d');

        if (this.undoList.length > 0) {
            let dataUrl = this.undoList.pop()
            this.redoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataUrl

            img.onload =  () => {
                ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)

                this.socket.send(JSON.stringify({
                    method: 'doMethod',
                    id: this.sessionid,
                    data: {
                        dataUrl: dataUrl,
                        method: 'undo'
                    }
                }));
            }
        } else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            this.socket.send(JSON.stringify({
                method: 'doMethod',
                id: this.sessionid,
                data: {
                    dataUrl: null,
                    method: 'undo'
                }
            }));
        }
    }

    redo() {
        let ctx = this.canvas.getContext('2d')
        if (this.redoList.length > 0) {
            let dataUrl = this.redoList.pop()
            this.undoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataUrl
            img.onload =  () => {
                ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                this.socket.send(JSON.stringify({
                    method: 'doMethod',
                    id: this.sessionid,
                    data: {
                        dataUrl: dataUrl,
                        method: 'redo'
                    }
                }));
            }
        }
    }
}

const canvasState = new CanvasState();

export default canvasState;
