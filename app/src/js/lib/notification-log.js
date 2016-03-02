'use strict';

/**
 * ビルド(の通知を)結果をHTMLに整形して出力する
 *
**/
var NotificationLog = class NotificationLog {
	constructor(jenkins, result, parentElement) {
		this.jenkins       = jenkins
		this.result        = result
		this.parentElement = parentElement
	}

	addNotificationLogRow() {
		var log = this.logElement
		var td  = document.createElement('td')
		td.insertBefore(this.iconElement, null)
		log.insertBefore(td, null)
		td = document.createElement('td')
		td.insertBefore(this.linkElement, null)
		log.insertBefore(td, null)
		td = document.createElement('td')
		td.insertBefore(this.timestampElement, null)
		log.insertBefore(td, null)
		this.parentElement.insertBefore(log, this.parentElement.firstChild)
	}

	addNotificationLog() {
		var log = this.logElement
		log.insertBefore(this.iconElement, null)
		log.insertBefore(this.linkElement, null)
		log.insertBefore(this.timestampElement, null)
		log.insertBefore(this.projectElement, null)
		this.parentElement.insertBefore(log, this.parentElement.firstChild)
	}


	get iconElement() {
		var icon = document.createElement('img')
		icon.src = this.jenkins.getJenkinsBallPath(this.result.result)

		return icon
	}

	get linkElement() {
		var link       = document.createElement('a')
		var resultUrl  = this.jenkins.httpUrl + '/job/' + this.result.project + '/' + this.result.number
		link.className = 'resultLink'
		link.href      = resultUrl
		link.innerText = '#' + this.result.number
		link.addEventListener('click', function(event) {
			event.preventDefault();
			require('shell').openExternal(this.href)
		})
		return link
	}

	get timestampElement() {
		var time = document.createElement('span')
		var date = new Date(this.result.timeStamp)
		time.innerText = date.toLocaleString()

		return time
	}

	get projectElement() {
		var project = document.createElement('span')
		project.innerText = this.result.project
		return project
	}

	get logElement() {
		var log = document.createElement('div')
		log.className = 'log'

		return log
	}
}

module.exports = NotificationLog