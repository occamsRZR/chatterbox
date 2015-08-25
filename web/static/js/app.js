// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import {Socket} from "deps/phoenix/web/static/js/phoenix"
import "deps/phoenix_html/web/static/js/phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".



class App {
    static init() {


	var socket = new Socket("/socket")
	socket.connect()
	socket.onClose( e => console.log("Closed Connection") )
	this.joinLobby(socket)
	this.joinChannel(socket, "rooms:lights")
    }

    static joinLobby(socket) {
	let username = $("#username")
	let msgBody = $("#message")
	let channel = socket.channel("rooms:lobby", {} )
	channel.join()
	    .receive( "error", () => console.log("Failed to connect") )
	    .receive( "ok",    () => console.log("Connected") )
	channel.on( "new:message", msg => this.renderMessage(msg) )
	msgBody.off("keypress")
	    .on("keypress", e => {
		if (e.keyCode == 13) {
		    channel.push("new:message", {
			user: username.val(),
			body: msgBody.val()
		    })
		    msgBody.val("")
		}
	    })
    }

    static joinChannel(socket, channelName) {
	let channel = socket.channel(channelName, {} )
	channel.join()
	    .receive( "error", () => console.log("Failed to connect") )
	    .receive( "ok",    () => console.log("Connected") )
	channel.on( "new:message", msg => this.renderMessage(msg) )
    }

    static renderMessage(message) {
	let messages = $("#messages")
	let user = this.sanitize(message.user || "New User")
	let body = this.sanitize(message.body)
	messages.append(`<p><b>[${user}]</b>: ${body}</p>`)
    }

    static sanitize(str) { return $("<div/>").text(str).html() }   
}

$( () => App.init() )

export default App
