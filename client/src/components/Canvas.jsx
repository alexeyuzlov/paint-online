import React, {useEffect, useRef} from 'react';
import "../styles/canvas.css"
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {useParams} from "react-router-dom"
import Rect from "../tools/Rect";
import axios from 'axios'
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";

// Это god object антипаттерн, здесь должны быть только методы для работы с canvas и ничего кроме
const Canvas = observer(() => {
    const canvasRef = useRef()
    const params = useParams()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);

        // fetchImage();

        // у тебя есть mobx стейты, по сути приложению не будет проблема иметь ещё один стейт для сокетов, вне canvas

        const socket = new WebSocket(`http://localhost:5000`);
        canvasState.setSocket(socket)
        canvasState.setSessionId(params.id)

        // это стейт уровня приложения выбирает интструмент для рисования
        // кстати, обрати внимание на логическую ошибку в зависимостях, тулзам норм знать только про canvas и всё
        toolState.setTool(new Brush(canvasRef.current, socket, params.id))

        socket.onopen = () => {
            socket.send(JSON.stringify({
                id: params.id,
                username: canvasState.username,
                method: "connection"
            }))
        }

        socket.onmessage = (event) => {
            let msg = JSON.parse(event.data)
            console.log(msg)
            switch (msg.method) {
                case "connection":
                    // console.log(`пользователь ${msg.username} присоединился`)
                    break
                case "draw":
                    drawHandler(msg)
                    break
                case "doMethod":
                    doHandler(msg)
                    break
            }
        }
    }, [])

    const drawHandler = (msg) => {
        // это фабричный метод, будет figure.draw(params) и всё
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')

        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth);
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.lineWidth, figure.strokeStyle);
                break
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.color, figure.lineWidth, figure.strokeStyle);
                break
            case "eraser":
                Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth);
                break
            case "line":
                Line.staticDraw(ctx, figure.startX, figure.startY, figure.endX, figure.endY, figure.color, figure.lineWidth);
                break
            case "finish":
                // это выглядит как хак, который нужен только для brush, чуть корректнее будет внутри brush делать доп параметр для финиша
                // понятно что это тоже будет не идеальное решение, но по крайней мере код будет лучше сцеплен, который отвечает за конкретную фигуру
                // здесь хорошо погуглить как на самом деле такое решается, т.к. асинхронные события могут и пропадать по сети
                ctx.beginPath()
                break
        }
    }

    const doHandler = (msg) => {
        const data = msg.data
        const ctx = canvasRef.current.getContext('2d') // обрати внимание как часто приходится получать контекст, напрашивается рефакторинг вынести контекст в стейт поближе к canvas

        switch (data.method) {
            case 'undo':
                handleUndo(ctx, data.dataUrl);
                break;
            case 'redo':
                handleRedo(ctx, data.dataUrl);
        }
    }

    function handleUndo(ctx, dataUrl) {
        if (dataUrl) {
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            };
        } else {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // не надо так, всё низкоуровневое рисование выносится в методы стейта по работе с canvas
        }
    }

    function handleRedo(ctx, dataUrl) {
        if (dataUrl) {
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            };
        }
    }

    async function fetchImage() {
        const ctx = canvasRef.current.getContext('2d');

        try {
            // Вся работа с апи / сокетами и т.д. выносится из компонентов, в .env можно хранить все адреса, удобнее менять и делать файлы окружений
            const response = await axios.get(`http://localhost:5000/image?id=${params.id}`);
            const img = new Image();
            img.src = response.data;
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            };
        } catch (error) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }

    const mouseDownHandler = () => {
        // canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
    }

    return (
        // Есть офигенное улучшение UX - сделать компонент курсора, который будет меняться в зависимости от выбранного инструмента
        // Второй уровент улучшения - присылать точку курсора по сокетам каждому из участников
        <div className="canvas" style={{paddingTop: 80, display: "grid", textAlign: "center"}}>
            <h3 style={{margin: 0}}>Рисунки Ашотика ОНЛАЙН!!!</h3>
            <canvas ref={canvasRef} width={1000} height={600}/>
        </div>
    );
});

export default Canvas;
