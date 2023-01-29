const formHandler = function(netObj){
    const [submitForm, getForm] = netObj.network.makeAction('form')
    netObj.formDB = new PouchDB('formDB' + netObj.boardid);
    
    getForm((data, peerId) =>{
        var submiterName = data.name
        var submitionDate = data.submitionDate
        var submiterId = peerId
        var formData = data.formData
        var submitionID = Math.floor(100000000 + Math.random() * 900000000).toString()

        

        netObj.formDB.put({
            _id: submitionID,
            submiterName: submiterName,
            submiterId: submiterId,
            formData: formData,
            submitionDate: submitionDate,
        });
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
            var ul = containerElement

            // Iterate through the JSON object
            for (var key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    // Create a new li element
                    var li = document.createElement("li");
                    // Set the li text to the value of the current key
                    li.innerHTML = key + ": " + jsonData[key];
                    // Append the li to the ul
                    ul.appendChild(li);
                }
            }
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export {formHandler, formSubmitter, formRenderer}