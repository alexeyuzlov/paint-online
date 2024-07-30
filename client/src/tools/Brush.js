import Tool from "./Tool";

export default class Brush extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false;

        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'finish',
            }
        }));
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }

    // тулзам не должно быть дела до сокетов совсем.
    // Правильное решение - это сделать тулзы mobx стейтами и выдывать событие наружу при отрисовке
    // Приложение будет слушать это событие и отправлять его в стейт сокетов, таким образом не будет сцепки между независимыми частями
    // Кстати, рисование у клиента должно быть сразу, без лагов и задержек,
    // а вот рассылка месседжа должна быть всем, кроме отправителя
    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: this.ctx.fillStyle,
                    lineWidth: this.ctx.lineWidth
                }
            }));
        }
    }

    static draw(ctx, x, y, color, lineWidth, socket) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}
