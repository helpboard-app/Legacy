import {net} from "./net.js"
import {formHandler} from "./formHandle.js"
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

var board = new net.Board({boardid: params.b, cb: function(status){
    new formHandler(board)
}})