(function() {
	'use strict';

	console.time('index')

	const HIDE_CLASS = 'invisible'
	const WIDE_CLASS = 'wide'

	// method define

	var changeBgImage = function(result, element) {
		var path = __dirname + '/src/images/'
		console.log(path)
		switch (result) {
			case 'SUCCESS':
				path += 'jenkins.png'
				break
			case 'FAILURE':
				path += 'angry-jenkins.png'
				break
			case 'ABORTED':
				path += 'sad-jenkins.png'
				break
			case 'UNSTABLE':
				path += 'sad-jenkins.png'
				break
			default :
				ath += 'sad-jenkins.png'
				console.log('Not compatible :', result)
				break
		}
		element.style.backgroundImage = 'url(' + require("path").resolve(path).replace(/\\/g, '\/') + ')'
	}

	var createWs = function(jenkins) {

		var ws = new WebSocket(jenkins.wsUrl)
		console.log(ws)

		ws.onopen = function() {
			console.log('Connect Ws')
			ipcRenderer.send('operation-tray', 'setToolTip', 'Connectiong : ' + jenkins.hostname)
		}

		ws.onclose = function() {
			console.log('Close Ws')
			ipcRenderer.send('operation-tray', 'setToolTip', 'Close : ' + jenkins.hostname)
		}

		ws.onmessage = function(event) {
			console.log('Receive Ws')
			var result = JSON.parse(event.data)
			// ログに表示するため、wsのタイムスタンプを追加する
			result.timeStamp = event.timeStamp
			// ステータス:STARTに対応(resultが無いので無視)
			if (!('result' in result)) {
				return
			}

			// プロジェクトフィルター
			if (jenkins.projects.length > 0 && jenkins.projects.indexOf(result.project) === -1) {
				return
			}

			// 結果フィルター
			if (jenkins.results.length > 0 && jenkins.results.indexOf(result.result) === -1) {
				return
			}

			ipcRenderer.send('operation-tray', 'setImage',       jenkins.getJenkinsTrayIconPath(result.result))
			ipcRenderer.send('operation-tray', 'displayBalloon', jenkins.getTrayContents(result))
			ipcRenderer.send('operation-tray', 'setToolTip',     result.project + ' : ' + result.result)

			var logCreater = require('./src/js/lib/notification-log.js')
			logCreater     = new logCreater(jenkins,result, document.getElementById('logTree'))
			logCreater.addNotificationLog()
			changeBgImage(result.result, document.getElementById('rightBox'))

			if (jenkins.voice) {
				speechSynthesis.speak(new SpeechSynthesisUtterance('Build, '+ result.result));
			}

		}

		ws.onerror = function(event){
			console.log('Error Ws')
			console.log(event)
			alert("Can't connect to " + event.target.url)
			ipcRenderer.send('operation-tray', 'setToolTip', 'Error!')
		}

		return ws
	}

	var initForm = function() {
		var storageSettings = JSON.parse(localStorage.getItem('settings'))
		if (!storageSettings) {
			return
		}

		document.getElementById('hostname').value   = 'hostname' in storageSettings ? storageSettings.hostname            : ''
		document.getElementById('port'    ).value   = 'port'     in storageSettings ? storageSettings.port                : ''
		document.getElementById('ws_port' ).value   = 'wsPort'   in storageSettings ? storageSettings.wsPort              : ''
		document.getElementById('projects').value   = 'projects' in storageSettings ? storageSettings.projects.join(', ') : ''
		document.getElementById('results' ).value   = 'results'  in storageSettings ? storageSettings.results.join(', ')  : ''
		document.getElementById('voice'   ).checked = 'voice'    in storageSettings ? storageSettings.voice               : ''
	}


	var hideForm = function(event) {
		var left  = document.getElementById('leftBox')
		var right = document.getElementById('rightBox')

		left.className  += ' ' + HIDE_CLASS
		right.className += ' ' + WIDE_CLASS

		this.removeEventListener('click', hideForm)
		this.addEventListener(   'click', showForm)
		this.children[0].innerText = '≫'

		localStorage.setItem('hideLeft', 'hide')
	}

	var showForm = function(event) {
		var left  = document.getElementById('leftBox')
		var right = document.getElementById('rightBox')

		left.className  = left.className.replace( new RegExp(' ' + HIDE_CLASS, 'g'), '')
		right.className = right.className.replace(new RegExp(' ' + WIDE_CLASS, 'g'), '')

		this.removeEventListener('click', showForm)
		this.addEventListener(   'click', hideForm)
		this.children[0].innerText = '≪'

		localStorage.removeItem('hideLeft')
	}

	var initWindow = function(win) {


		// ウィンドウ位置を復元
		if (localStorage.getItem("windowPosition")) {
			var pos = JSON.parse(localStorage.getItem("windowPosition"));
			win.setPosition(pos[0], pos[1]);
		}

		// クローズ時にウィンドウ位置を保存
		win.on('close', function() {
			localStorage.setItem('windowPosition', JSON.stringify(win.getPosition()));
		})

		// リロード対策。リロード時はcloseは呼ばれない。
		// main processに解放済みのrendererのイベントが残って、closeイベントが重複登録されるのを防ぐ。
		window.addEventListener('beforeunload', function() {
			win.removeAllListeners('close')
		})



		// wait read css and show 
		win.show()
	} 

	// method define end

	var ipcRenderer = require('electron').ipcRenderer;

	var mainWindow = require("remote").getCurrentWindow()
	initWindow(mainWindow)
	initForm()

	var Jenkins = require("./src/js/lib/jenkins.js");
	var jenkins = new Jenkins(JSON.parse(localStorage.getItem('settings')))



	var ws = createWs(jenkins)

	document.getElementById('register').addEventListener('click', function() {
		document.querySelector(':invalid')

		if (document.querySelector(':invalid')) {
			console.log('無効な入力値があります')
			console.log(document.querySelector(':invalid').validationMessage)
			alert('invalid inputs')
			return
		}

		var settings = {
			hostname: document.getElementById('hostname').value,
			port    : document.getElementById('port'    ).value,
			wsPort  : document.getElementById('ws_port' ).value,
			projects: document.getElementById('projects').value.split(',').map(function(e){ return e.trim()}).filter(function(e) { return (e !== '')}),
			results : document.getElementById('results' ).value.split(',').map(function(e){ return e.trim()}).filter(function(e) { return (e !== '')}),
			voice   : document.getElementById('voice'   ).checked
		}

		localStorage.setItem('settings', JSON.stringify(settings));

		jenkins = new Jenkins(settings)

		ws.close()
		ws = createWs(jenkins)

		return
	})

	document.getElementById('clearLog').addEventListener('click', function() {
		var logs = document.getElementById('logTree')
		while (logs.firstChild) {
			logs.removeChild(logs.firstChild);
		}
	})

	document.getElementById('exit').addEventListener('click', function() {
		require("remote").getCurrentWindow().close()
	})

	document.getElementById('centerBar').addEventListener('click', hideForm)

	// 隠すボタンクリックをエミュレートすることでで前回表示を再現するが、もっとスマートにしたい
	if (localStorage.getItem('hideLeft')) {
		document.getElementById('centerBar').click()
	}

	console.timeEnd('index')
})()
