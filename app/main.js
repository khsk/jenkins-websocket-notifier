'use strict'

var app = require('app')
var BrowserWindow = require('browser-window')

require('crash-reporter').start({
	companyName:'khsk',
	submitURL: 'https://github.com/khsk/jenkins-websocket-notifier',
})

var mainWindow = null

app.on('window-allclosed', function(){
	if (process.platoform != 'darwin') {
		app.quit()
	}
})

app.on('ready', function() {

	var Tray = require('tray')
	var tray = new Tray(__dirname + '/src/images/headshot18x18.png')

	var Menu = require("menu");
	var contextMenu = Menu.buildFromTemplate([
		{ label: 'Show', click: function() { mainWindow.show() } },
		{ label: 'Exit', click: function() { app.quit() } }
	]);
	tray.setContextMenu(contextMenu);

	tray.on('click', function() {
		// TODO フォーカス時は隠す、非フォーカス時はフォーカス、としたいが、トレイクリック時にフォーカスが外れるみたいで難しい
		if (mainWindow.isVisible()) {
			mainWindow.hide()
		} else {
			mainWindow.show()
		}
		
	})

	tray.on('balloon-click', function() {
		mainWindow.focus()
	})
	var ipcMain = require('electron').ipcMain;
	ipcMain.on('operation-tray', function(event, method, arg) {
		tray[method](arg)
	})

	mainWindow = new BrowserWindow({'width': 800, 'height': 600, 'frame': false, 'show': false, 'skip-taskbar': true})

	mainWindow.loadURL('file://' + __dirname + '/index.html')

	mainWindow.on('closed', function() {
		mainWindow = null
	})



})
