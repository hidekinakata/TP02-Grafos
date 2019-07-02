module.exports = (win, app) => {
    const ipc = require("electron").ipcMain;

    // botao de sair
    ipc.on("close-operation", function(event, arg) {
        app.quit();
    });

    

};

