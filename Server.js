const express= require("express");
const app= express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;

const url="mongodb://localhost:127.0.0.1:27017/";
const dbName='Inventory';
let db;
let k;
MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
    if(err)
    return console.log(err);
    db=client.db(dbName);
});

app.listen(9000,()=>{
    console.log('Server is listening on port 9000');
});
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/',(req,res)=>{
        db.collection('Book').find().toArray((err,result)=>{
            if(err)
            return console.log(err);
            res.render('./home.ejs',{data:result});
        })
});


app.get('/add',(req,res)=>{
      res.render('add.ejs');
});
app.get('/update',(req,res)=>{
    res.render('update.ejs');
});

app.get('/delete',(req,res)=>{
    res.render('delete.ejs');
});

app.get('/edit',(req,res)=>{
    res.render('edit.ejs');
});

app.post('/Add',(req,res)=>{
    db.collection('Book').insertOne(req.body, (err,result)=>{
        if(err)
        return console.log(err);
        res.redirect('/');
    })
});

app.post('/Update',(req,res)=>{
    db.collection('Book').find().toArray((err,result)=>{
        if(err)
        return console.log(err);
        for(var i=0;i<result.length;i++){
            if(result[i].bid==req.body.bid){
                k=i;
                break;
            }
        }
        db.collection('Book').findOneAndUpdate({'bid': req.body.bid},{$set: {stock: parseInt(result[k].stock)+parseInt(req.body.stock)}},{sort: {_id:-1}},
        (err,result)=>{
            if(err)
                res.send(err);
            res.redirect('/');
        })
        })
});

app.post('/Delete',(req,res)=>{
    db.collection('Book').findOneAndDelete({'bid': req.body.bid}, (err,result)=>{
        if(err)
          res.send(err);
          res.redirect('/');
    })
});

app.post('/Edit',(req,res)=>{
    db.collection('Book').find().toArray((err,result)=>{
        if(err)
        return console.log(err);
        //console.log(req.body.cost);
        db.collection('Book').findOneAndUpdate({'bid': req.body.bid},{$set: {cost: parseInt(req.body.cost)}},{sort: {_id:-1}},
        (err,result)=>{
            if(err)
                res.send(err);
            res.redirect('/');
        })
        })
});