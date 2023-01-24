import {joinRoom} from 'https://cdn.skypack.dev/trystero'
const baseConfig = {appId: 'HelpboardLegacy'}

const hbnet = {
    Board: function({name, jsonformurl, boardID, debug, loadfromdb}){
        this.debug = debug
        var boards = new PouchDB('boards');
        if (boardID != null && Number.isInteger(boardID) && boardID.toString().length == 9 && loadfromdb == true){
            this.boardID = boardID
            loadfromdb = true
        } else {
            this.boardID = Math.floor(100000000 + Math.random() * 900000000)
            loadfromdb = false
        }
        if(loadfromdb != false){
            boards.get(this.boardID.toString()).then(function (doc){
                this.boardName = doc.name
                this.formJsonUrl = doc.jsonformurl
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            this.boardName = name
            this.formJsonUrl = jsonformurl
        }
        this.boardID_parsed = this.boardID.toString().match(/.{1,3}/g)
        this.boardID_todisplay = this.boardID_parsed[0] + "-" + this.boardID_parsed[1] + "-" + this.boardID_parsed[2]
        this.dbconnectForm = new PouchDB("connectForm" + this.boardID.toString())

        if(loadfromdb != false){
            // Do nothing
        } else {
            boards.put({
                _id: this.boardID.toString(),
                boardID: this.boardID.toString(),
                name: this.boardName,
                jsonformurl: this.formJsonUrl,
            });
        }

        this.host = function(){
            // Connect to the HBL Network
            try {
                this.room = joinRoom(baseConfig, this.boardID.toString())
            } catch {
                alert("Couldn't connect to the HBL network!")
                throw new Error("Couldn't connect to the HBL network!");
            }
            // Handle Debug
            if(this.debug == true){
                this.room.onPeerJoin(peerId => console.log(`${peerId} joined`))
                this.room.onPeerLeave(peerId => console.log(`${peerId} left`))
            }
            // Initialize Actions
            const [submitConnectForm, receiveConnectForm] = this.room.makeAction('connectForm')
            const [sendMeta, getMeta] = this.room.makeAction('meta')
            const [sendName, getName] = this.room.makeAction('name')

            const idsToNames = {}
            function inverse(obj){
                var retobj = {};
                for(var key in obj){
                  retobj[obj[key]] = key;
                }
                return retobj;
            }
            // Handle Actions
            getName((name, peerId) => (idsToNames[peerId] = name))

            // Check for existing admins before declaring ourself as admin
            // Wait 5 seconds for an admin to announce their presence
            setTimeout(function(){
                if (inverse(idsToNames)['87ab8a8b-35eb-45b8-a826-c9babdbbcdf8'] != null) {
                    alert("Admin Already Exists!")
                    throw new Error("Admin Already Exists!");
                } else {
                    this.room.onPeerJoin(peerId => sendName('87ab8a8b-35eb-45b8-a826-c9babdbbcdf8', peerId))
                    this.room.onPeerJoin(peerId => sendMeta(JSON.stringify({jsonformurl: jsonformurl}), peerId))
                    sendName('87ab8a8b-35eb-45b8-a826-c9babdbbcdf8')
                    sendMeta(JSON.stringify({jsonformurl: jsonformurl}))
                }
            }, 5000);
            receiveConnectForm((data, peerId) => {
                if(this.debug == true){
                    console.log(
                        `Received A connectForm!
                         peerId = ${peerId}
                         formalName = ${idsToNames[peerId] || 'a weird stranger'}
                         data = ${data}`
                    )
                }
                this.dbconnectForm.put({
                    _id: Math.floor(10000000 + Math.random() * 90000000),
                    peerId: peerId,
                    formalName: idsToNames[peerId] || 'a weird stranger',
                    data: data,
                });
            })
        }
        this.disconnect = function(){
            // Disconnect from the HBL Network
            this.room.leave()
        }
    },
    ConnectForm: function(data, boardID, name, debug){
        this.data = data
        this.boardID = boardID
        this.name = name
        this.debug = debug
        this.meta = {}
        this.send = function(){
            // Connect to the HBL Network
            try {
                this.room = joinRoom(baseConfig, this.boardID.toString())
            } catch {
                alert("Couldn't connect to the HBL network!")
                throw new Error("Couldn't connect to the HBL network!");
            }
            // Handle Debug
            if(this.debug == true){
                this.room.onPeerJoin(peerId => console.log(`${peerId} joined`))
                this.room.onPeerLeave(peerId => console.log(`${peerId} left`))
            }
            // Initialize Actions
            const [submitConnectForm, receiveConnectForm] = this.room.makeAction('connectForm')
            const [sendName, getName] = this.room.makeAction('name')
            const [sendMeta, getMeta] = this.room.makeAction('meta')
            function inverse(obj){
                var retobj = {};
                for(var key in obj){
                  retobj[obj[key]] = key;
                }
                return retobj;
            }
            const idsToNames = {}
            // Handle Actions
            getMeta((data, peerId) => (this.meta = JSON.parse(data)))

            this.room.onPeerJoin(peerId => sendName(name, peerId))
            sendName(name)
            getName((name, peerId) => (idsToNames[peerId] = name))
            submitConnectForm(this.data, inverse(idsToNames)['87ab8a8b-35eb-45b8-a826-c9babdbbcdf8'])
            // Disconnect from the HBL Network
            this.room.leave()
        }
        this.disconnect = function(){
            // Disconnect from the HBL Network
            this.room.leave()
        }
    }
}

export {hbnet}