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

const Canvas = observer(() => {
    const canvasRef = useRef()
    const params = useParams()

    useEffect(() => {
        const fetchImage = async () => {
            canvasState.setCanvas(canvasRef.current);
            const ctx = canvasRef.current.getContext('2d');

            try {
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
        };

        //fetchImage();
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`https://b615-188-166-69-107.ngrok-free.app`);
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)

            toolState.setTool(new Brush(canvasRef.current, socket, params.id))

            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id:params.id,
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
        }
    })

    const drawHandler = (msg) => {
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
                ctx.beginPath()
                break
        }
    }

    const doHandler = (msg) => {
        const data = msg.data
        const ctx = canvasRef.current.getContext('2d')

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
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
    }

    return (
        <div className="canvas" style={{paddingTop: 80, display: "grid", textAlign: "center"}}>
            <h3 style={{margin: 0}}>Рисунки Ашотика ОНЛАЙН!!!</h3>
            <canvas ref={canvasRef} width={1000} height={600}/>
        </div>
    );
});

export default Canvas;
