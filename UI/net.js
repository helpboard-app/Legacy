import {joinRoom} from 'https://cdn.skypack.dev/trystero'
const baseConfig = {appId: 'HelpboardLegacy'}

const net = {
    Board: function({boardid, cb, name}){
        this.statusHandler = function(status){
            return status;
        }
        this.db = new PouchDB('board' + boardid);
        this.boardsdb = new PouchDB('boards');
        this.network = joinRoom(baseConfig, boardid.toString())
        this.boardid = boardid

        this.network.onPeerJoin(peerId => console.log(`${peerId} joined`))
        this.network.onPeerLeave(peerId => console.log(`${peerId} left`))
        const [sendClmsg, getClmsg] = this.network.makeAction('clmsg')
        getClmsg((data, peerId) =>
            console.log(
                `${peerId}: ${data}`
            )
        )

        this.boardsdb.get(boardid.toString()).then(function (doc) {
            cb({status: "initalized"})
          }).catch(function (err) {
            var boardsdb = new PouchDB('boards');
            if (err.status === 404) {
                boardsdb.put({
                    _id: boardid.toString(),
                    boardID: boardid.toString(),
                    name: name,
                }).then(function (doc) {
                    cb({status: "initalized"})
                })
            } else {
              console.log('Error checking for document:', err);
              cb({status: "failedinit"})
              //this.statusHandler({status: false, err: `Error checking for document: ${err}`})
            }
        });
    },
    Client: function({boardid, cb}){
        this.statusHandler = function(status){
            return true;
        }
        this.network = joinRoom(baseConfig, boardid.toString())
        this.boardid = boardid
        cb({status: "initalized"})
    }
}

export {net}