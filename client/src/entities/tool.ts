import Brush from "../tools/Brush";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Rect from "../tools/Rect";
import Line from "../tools/Line";

export type Tool = Brush | Circle | Rect | Line | Eraser;

export enum ToolName {
    Brush = "brush",
    Rect = "rect",
    Circle = "circle",
    Eraser = "eraser",
    Line = "line"
}

export interface IBaseToolParams {
    fillColor?: string | CanvasGradient | CanvasPattern;
    strokeColor: string | CanvasGradient | CanvasPattern;
    lineWidth: number;
}

export interface IDrawData {
    type: ToolName;
    params: any;
}

export interface IBrushDrawParams extends IBaseToolParams {
    x: number;
    y: number;
}

export interface IBrushParams {
    isFinish: boolean;
    brushParams?: IBrushDrawParams;
}

export interface ICircleDrawParams extends IBaseToolParams {
    x: number;
    y: number;
    radius: number;
    fillColor: string | CanvasGradient | CanvasPattern;
    hasStroke: boolean;
}

export interface IRectDrawParams extends IBaseToolParams {
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string | CanvasGradient | CanvasPattern;
    hasStroke: boolean;
}

export interface ILineDrawParams extends IBaseToolParams {
    x: number;
    y: number;
    endX: number;
    endY: number;
}