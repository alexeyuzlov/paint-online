import React from 'react';
import '../styles/toolbar.css'
import toolState from "../store/tool.state";
import canvasState from "../store/canvas.state";
import {ToolName} from "../entities/tool";
import undoRedoState from "../store/undo-redo.state";
import {observer} from "mobx-react-lite";

const Toolbar = observer(() => {
    const buttons = [
        { name: ToolName.Brush, className: ToolName.Brush },
        { name: ToolName.Rect, className: ToolName.Rect },
        { name: ToolName.Circle, className: ToolName.Circle },
        { name: ToolName.Eraser, className: ToolName.Eraser },
        { name: ToolName.Line, className: ToolName.Line }
    ];

    return (
        <div className="toolbar">
            <div className="toolbar__tools">
                {buttons.map((btn) => (
                    <div
                        key={btn.name}
                        className={`toolbar__btn toolbar-btn ${toolState.currentToolName === btn.name ? 'active' : ''}`}
                    >
                        <button
                            className={`toolbar-btn__content ${btn.className}`}
                            onClick={() => toolState.setTool(btn.name)}
                        />
                    </div>
                ))}
            </div>
            <div className="toolbar__actions">
                <div className="toolbar__btn toolbar-btn">
                    <button
                        className="toolbar-btn__content undo"
                        onClick={() => undoRedoState.undo()}
                    />
                </div>
                <div className="toolbar__btn toolbar-btn">
                    <button
                        className="toolbar-btn__content redo"
                        onClick={() => undoRedoState.redo()}
                    />
                </div>
                <div className="toolbar__btn toolbar-btn">
                    <button
                        className="toolbar-btn__content save"
                        onClick={() => canvasState.download()}
                    />
                </div>
            </div>
        </div>
    );
});

export default Toolbar;
