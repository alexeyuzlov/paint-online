import React, {useEffect, useRef} from 'react';
import "../styles/canvas.css"
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvas.state";
import toolState from "../store/tool.state";
import {useParams} from "react-router-dom"
import {fetchImage} from "../handlers/fetch-image";
import socketState from "../store/socket.state";
import {ImageService} from "../services/image.service";
import undoRedoState from "../store/undo-redo.state";

const Canvas = observer(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const urlParams = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current!);
        toolState.init(canvasRef.current!);
        undoRedoState.init(canvasRef.current!);

        fetchImage(canvasRef.current!, urlParams.id!)
            .then(() => socketState.connect());
    }, [urlParams.id]);

    // корректнее делать добавление в UndoRedo при mouseup
    const handleMouseDown = () => {
        // Вопрос, что лучше, такое обращение через стейт или через референс, т к канвас уже получен в текущем компоненте?
        // Похожий вопрос в стейте с сокетами

        // лучше через ref в данном случае. Но если перепишешь CanvasState, где будут данные, а не ссылка на DOM элемент, то лучше через стейт,
        // т.к. при наличии стейта компоненты заботятся только о диспатче конкретных действий (как controller в mvc)
        const imgUrl = canvasState.canvasDataUrl;

        if (imgUrl) {
            undoRedoState.pushToUndo(imgUrl);
        }
    };

    const handleMouseUp = () => {
        const imgUrl = canvasState.canvasDataUrl;

        if (imgUrl) {
            ImageService.setImage(urlParams.id!, imgUrl);
        }
    }

    return (
        // Второй уровень улучшения - присылать точку курсора по сокетам каждому из участников
        <div className="canvas">
            <h3 className="canvas__title">Рисунки Ашотика ОНЛАЙН!!!</h3>
            <canvas
                className="canvas__item"
                onMouseDown={() => handleMouseDown()}
                onMouseUp={() => handleMouseUp()}
                ref={canvasRef}
                width={900}
                height={600}
            />
        </div>
    );
});

export default Canvas;