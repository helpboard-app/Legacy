const formHandler = function(netObj, cb){
    const [submitForm, getForm] = netObj.network.makeAction('form')
    netObj.formDB = new PouchDB('formDB' + netObj.boardid);
    
    getForm((data, peerId) =>{
        var submiterName = data.name
        var submitionDate = data.submitionDate
        var submiterId = peerId
        var formData = data.formData
        var submitionID = Math.floor(100000000 + Math.random() * 900000000).toString()

        console.log(
            `${peerId} sent form:
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
            cb({message: "datasubmit"})
        })
    })
}

const formSubmitter = function(netObj){
    const [submitForm, getForm] = netObj.network.makeAction('form')
    
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