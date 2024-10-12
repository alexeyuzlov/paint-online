// серверную часть очень легко перевести на ts через сборку webpack
// а для сокетов можно использовать socket.io, т.к. она позволяет читать привычными паттернами и имеет ряд фолбеков
module.exports = function (app, aWss) {
    app.ws('/', (ws, req) => {
        ws.on('message', (msg) => {
            msg = JSON.parse(msg);
            switch (msg.method) {
                case "connection":
                    connectionHandler(ws, msg);
                    break;
                case "draw":
                case "do":
                case "changeDrawParam":
                    broadcastConnection(ws, msg);
                    break;
            }
        });

        // а ещё есть F5 - когда юзер отконнекчивается и переподключается, у него новый id, старый надо прибивать
        ws.on('connection', (msg) => {
            msg = JSON.parse(msg);
            console.log(msg);
        });
    });

    const connectionHandler = (ws, msg) => {
        ws.id = msg.id;
        broadcastConnection(ws, msg);
    };

    const broadcastConnection = (ws, msg) => {
        aWss.clients.forEach(client => {
            if (client.id === msg.id) {
                client.send(JSON.stringify(msg));
            }
        });
    };
};