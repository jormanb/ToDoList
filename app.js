const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const { redirect } = require('express/lib/response');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/todolist', {UseNewUrlParser:true});

const todolistSchema = new mongoose.Schema({
    content: String,
    _id: String
})

const task = new mongoose.model('Task', todolistSchema);

let date = new Date();
let param = {
    weekday: "long",
    day: "numeric",
    month: "long",
}
let today = date.toLocaleDateString("es-ES", param);
let size = -1;

app.get("/", (req, res)=>{
    task.find().then(itemList => {
        size = itemList.length;
        res.render('index', {Fecha: today, Lista: itemList});
    }).catch(err => {
        console.log(err);
    })
})

function genID ( ) {
    return parseInt((Math.random()*date.getMilliseconds())*10000000);
}

app.post("/add", (req, res)=>{
    let item = req.body.newItem;
    if (item != "") {
        task.create({content:item, _id: genID()}).then(query=>{res.redirect("/");})
    } else {
        res.redirect("/");
    }
})

function del (list) {
    if(list.length) {
        __id = list[(list.length-1)];
        list.pop();
        task.deleteOne({_id:__id}).then(res => {
            del(list);
            return;
        }).catch (err => {
            console.log(err);
        })
    }
    return;
}

app.post("/erase", (req, res)=>{
    let id = Object.keys(req.body);
    console.log(id);
    del(id);
    res.redirect('/');
})

app.listen(3000, ()=>{
    console.log("Server started on port 3000");
})