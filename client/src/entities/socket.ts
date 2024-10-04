export enum SocketEvent {
    Connection = "connection",
    Do = "do",
    Draw = "draw",
    ChangeDrawParam = "changeDrawParam",
}

export interface SocketMessageData {
    method: SocketEvent;
    data?: UndoRedoSocketData | ChangeDrawParamSocketData | any;
}

export interface SocketMessage extends SocketMessageData {
    username: string,
    id: string,
}

export interface UndoRedoSocketData {
    undo: string[],
    redo: string[],
    method: UndoRedoSocketMethod;
    dataUrl?: string;
}

export enum UndoRedoSocketMethod {
    PushUndo = 'push-undo',
    Undo = 'undo',
    Redo = 'redo'
}

export interface ChangeDrawParamSocketData {
    type: ChangeDrawParamSocketType;
    value: any;
}

export enum ChangeDrawParamSocketType {
    HasStroke = 'hasStroke',
    LineWidth = 'lineWidth',
    FillColor = 'fillColor',
    StrokeColor = 'strokeColor'
}