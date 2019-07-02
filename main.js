const { app, BrowserWindow, Menu } = require("electron");
// Mantém a referência global do objeto da janela.
// se você não fizer isso,
// a janela será fechada automaticamente
// quando o objeto JavaScript for coletado como lixo.
let win;

function createWindow() {
    // Criar uma janela de navegação.
    win = new BrowserWindow({
        width: 900,
        height: 400,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });

    win.once('ready-to-show', () => {
        win.show()
    })
    
    // and load the index.html of the app.
    win.loadFile("./src/index.html");

    // Emitido quando a janela é fechada.
    win.on("closed", () => {
        // Elimina a referência do objeto da janela, geralmente você iria armazenar as janelas
        // em um array, se seu app suporta várias janelas, este é o momento
        // quando você deve excluir o elemento correspondente.
        win = null;
    });


    Menu.setApplicationMenu(null);
}

// Este método será chamado quando o Electron tiver finalizado
// a inicialização e está pronto para criar a janela browser.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.on("ready", createWindow);

// Finaliza quando todas as janelas estiverem fechadas.
app.on("window-all-closed", () => {
    // No macOS é comum para aplicativos e sua barra de menu
    // permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});


require("./ipcMain_events")(win, app);
require("./graphProcessing")(win, app);