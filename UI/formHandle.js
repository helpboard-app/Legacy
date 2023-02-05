const formHandler = function(netObj, cb){
    const [submitForm, getForm] = netObj.network.makeAction('form')
    const [sendSuccess, getSuccess] = netObj.network.makeAction('sigsuccess')
    const [sendMeta, getMeta] = netObj.network.makeAction('meta')

    var socreq = false

    netObj.formDB = new PouchDB('formDB' + netObj.boardid);
    
    if(!cb){
        cb = function(){}
    }

    netObj.db.get('manageboard').then(function (doc) {
        socreq = doc.socreq
    }).catch(function (err) {
        console.log(err);
    });

    getMeta((data, peerId) => {
        console.log("sent meta " + JSON.stringify({socreq: socreq}) + " to " + peerId)
        sendMeta({socreq: socreq}, peerId)
    })    

    getForm((data, peerId) =>{
        var submiterName = data.name
        var submitionDate = data.submitionDate
        var submiterId = peerId
        var formData = data.formData
        var submitionID = Math.floor(100000000 + Math.random() * 900000000).toString()

        console.log(
            `   ${peerId} sent form:
            ${submiterName}
            ${submitionDate}
            ${submiterId}
            ${formData}
            ${submitionID}`
        )

        netObj.formDB.put({
            _id: submitionID,
            submiterName: submiterName,
            submiterId: submiterId,
            formData: formData,
            submitionDate: submitionDate,
        }).then(function(){
            sendSuccess("formsubmitsuccess", peerId)
            cb({message: "datasubmit"})
        }).catch(function (err) {
            sendSuccess("formsubmitfail", peerId)
            console.log(err)
        })
    })
}

const formSubmitter = function(netObj, cb){
    const [submitForm, getForm] = netObj.network.makeAction('form')
    const [sendSuccess, getSuccess] = netObj.network.makeAction('sigsuccess')
    const [sendMeta, getMeta] = netObj.network.makeAction('meta')

    if(!cb){
        cb = function(){}
    }

    sendMeta("", netObj.adminPeerID)
    console("requested meta from " + netObj.adminPeerID)

    getMeta((data, peerId) => {
        if(data.socreq == true){
            cb({status: "socialidrequired"})
        } else {
            cb({status: "ready"})
        }
    }) 

    getSuccess((data, peerId) => {
        if(data == "formsubmitsuccess"){
            this.success = true
        } else {
            this.success = false
        }
        cb({status: data})
    })
    
    this.submit = function(submiterName, formData){
        submitForm({
            name: submiterName,
            submitionDate: Date.now(),
            formData: formData,
        })
    }
}

const formRenderer = function(netObj){
    netObj.formDB = new PouchDB('formDB' + netObj.boardid);
    
    this.renderResponse = function(submitionID, containerElement){
        netObj.formDB.get(submitionID).then(function (doc) {
            var jsonData = doc.formData
            var div = containerElement

            // Iterate through the JSON object
            for (var key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    // Create a new p element
                    var p = document.createElement("p");
                    // Set the p text to the value of the current key
                    p.innerHTML = key + ": " + jsonData[key];
                    // Append the p to the div
                    div.appendChild(p);
                }
            }
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export {formHandler, formSubmitter, formRenderer}