'use strict';

// NOTICE result はプロパティでもって、結果の判定は内部で行ったほうがいい？ 
var Jenkins = class Jenkins {
	constructor(data) {
		this.hostname = 'localhost'
		this.port     = '8080'
		this.wsPort   = '8081'
		// permit values
		this.projects = []
		this.results  = []
		this.voice    = false

		// null かつ type が object に対応
		if (typeof data === 'object' && data !== null) {
			this.hostname = 'hostname' in data ? data.hostname.replace(/^\/|\/$/g,'') : this.hostname
			this.port     = 'port'     in data ? data.port                            : this.port
			this.wsPort   = 'wsPort'   in data ? data.wsPort                          : this.wsPort
			this.projects = 'projects' in data ? data.projects                        : this.projects
			this.results  = 'results'  in data ? data.results                         : this.results
			this.voice    = 'voice'    in data ? data.voice                           : this.voice
		}
	}

	get httpUrl() {
		return 'http://' + this.hostname + ':' + this.port
	}

	get wsUrl() {
		return 'ws://'   + this.hostname + ':' + this.wsPort + '/jenkins'
	}

	getTrayBodyTemplate(result) {
		return `Project : ${result.project}
Build number: ${result.number}
Status : ${result.status}`
	}

	getTrayContents(result) {
		return {
			title   : 'BUILD ' + result.result,
			content : this.getTrayBodyTemplate(result)
		}
	}

	getTrayContentsSuccess(result) {
		return {
			title   : 'build succeeded',
			content : this.getTrayBodyTemplate(result)
		}
	}

	getTrayContentsFailure(result) {
		return {
			title   : 'build failed',
			content : this.getTrayBodyTemplate(result)
		}
	}

	getTrayContentsAborted(result) {
		return {
			title   : 'build aborted',
			content : this.getTrayBodyTemplate(result)
		}
	}

	getTrayContentsUnstable(result) {
		return {
			title   : 'build unstable',
			content : this.getTrayBodyTemplate(result)
		}
	}

	getJenkinsTrayIconPath(result) {
		var path = __dirname + '/../../images/'
		switch (result) {
			case 'SUCCESS':
				path += 'headshot18x18.png'
				break
			case 'FAILURE':
				path += 'angry-headshot18x18.png'
				break
			case 'ABORTED':
				path += 'sad-headshot18x18.png'
				break
			case 'UNSTABLE':
				path += 'sad-headshot18x18.png'
				break
			default :
				path += 'sad-headshot18x18.png'
				break
		}
		return require("path").resolve(path)
	}

	getJenkinsBallPath(result) {
		var path = __dirname + '/../../images/16x16/'
		switch (result) {
			case 'SUCCESS':
				path += 'blue.png'
				break
			case 'FAILURE':
				path += 'red.png'
				break
			case 'ABORTED':
				path += 'gray.png'
				break
			case 'UNSTABLE':
				path += 'yellow.png'
				break
			default :
				path += 'gray.png'
				break
		}
		return require("path").resolve(path)
	}

}

module.exports = Jenkins
