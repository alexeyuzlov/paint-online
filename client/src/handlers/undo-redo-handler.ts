import {setImageHandler} from "./set-image-handler";
import undoRedoState from "../store/undo-redo.state";
import {UndoRedoSocketData} from "../entities/socket";

export const undoRedoHandler = (data: UndoRedoSocketData, canvasRef: HTMLCanvasElement) => {
    undoRedoState.undoList = data.undo;
    undoRedoState.redoList = data.redo;

    if (data?.dataUrl) {
        setImageHandler(canvasRef, data.dataUrl);
    }
}