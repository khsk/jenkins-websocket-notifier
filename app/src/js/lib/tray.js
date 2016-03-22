'use strict';

var Tray = class Tray {
	constluct() {
		this.tray = null
	}

	hasTray() {
		return !!this.tray
	}

	makeTray(icon) {
		icon = icon.toString()

		// TODO リロードでトレイが増える
		var remote = require('remote')
		var Tray = remote.require('tray')

		this.tray = new Tray(icon)
		this.tray.displayBalloon({icon:icon, title:"test",content:'content'})
	}
}

module.exports = Tray