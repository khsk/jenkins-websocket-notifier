'use strict';

var Tray = class Tray {
	constluct() {
		this.tray = null
	}

	hasTray() {
		console.log('hasTray')
		console.log(this.tray)
		console.log(!this.tray)
		console.log(!!this.tray)

		return !!this.tray
	}

	makeTray(icon) {
		icon = icon.toString()

		// TODO リロードでトレイが増える
		var remote = require('remote')
		var Tray = remote.require('tray')

		console.log(icon)
		this.tray = new Tray(icon)
		console.log(this.tray)
		this.tray.displayBalloon({icon:icon, title:"test",content:'content'})
	}
}

module.exports = Tray