const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


let date = new Date();
let param = {
    weekday: "long",
    day: "numeric",
    month: "long",
}
let today = date.toLocaleDateString("es-ES", param);

let itemList = [];

function Erase (claves) {
    let cont=0;
    let keycont=0;
    for (let i=0; i<itemList.length; i++) {
        if (i == claves[keycont]) {
            keycont++;
        } else {
            itemList[cont] = itemList[i];
            cont++;
        }
    }
    while(itemList.length > cont) {
        itemList.pop();
    }
}

app.get("/", (req, res)=>{
    res.render('index', {Fecha: today, Lista: itemList});
})


app.post("/add", (req, res)=>{
    let item = req.body.newItem;
    if (item != "") {
        itemList.push(item);
        res.redirect("/");
    }
})

app.post("/erase", (req, res)=>{
    Erase(Object.keys(req.body));
    res.redirect("/");
})

app.listen(3000, ()=>{
    console.log("Server started on port 3000");
})