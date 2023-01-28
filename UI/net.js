import {joinRoom} from 'https://cdn.skypack.dev/trystero'
const baseConfig = {appId: 'HelpboardLegacy'}

const net = {
    Board: function({boardid}){
        this.statusHandler = function(status){
            return true;
        }
        this.db = new PouchDB('board' + boardid);
        this.boardsdb = new PouchDB('boards');
        this.network = joinRoom(baseConfig, boardid.toString())
        this.boardid = boardid

        this.boardsdb.get(boardid).then(function (doc) {
          }).catch(function (err) {
            if (err.status === 404) {
                this.db.put({
                    _id: boardid.toString(),
                    boardID: boardid.toString()
                });
            } else {
              console.log('Error checking for document:', err);
              this.statusHandler({status: false, err: `Error checking for document: ${err}`})
            }
        });
    },
    Client: function({boardid}){
        this.statusHandler = function(status){
            return true;
        }
        this.network = joinRoom(baseConfig, boardid.toString())
        this.boardid = boardid
    }
}

export {net}