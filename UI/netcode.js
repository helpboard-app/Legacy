import {joinRoom} from 'https://cdn.skypack.dev/trystero'
const baseConfig = {appId: 'HelpboardLegacy'}

const hbnet = {
    Board: function(name, jsonformurl, debug){
        this.boardName = name
        this.formJsonUrl = jsonformurl
        this.boardID = Math.floor(100000000 + Math.random() * 900000000)
        this.boardID_parsed = this.boardID.toString().match(/.{1,3}/g)
        this.boardID_todisplay = this.boardID_parsed[0] + "-" + this.boardID_parsed[1] + "-" + this.boardID_parsed[2]
        this.host = function(){
            this.room = joinRoom(config, this.boardID.toString())
            if(debug == true){
                room.onPeerJoin(peerId => console.log(`${peerId} joined`))
                room.onPeerLeave(peerId => console.log(`${peerId} left`))
            }
            
        }
    }
}