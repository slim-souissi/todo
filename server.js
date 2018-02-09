const express = require('express');
const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const app = express();
const port = 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/todo', (err, client) => {
        if (err) return console.log(err );
        let db = client.db('todo');
        closure(db);
    });
};

app.get('/:id/todos',(req,res)=>{
    let query = {_id:ObjectID(req.params.id)};
    connection(db=>{
        db.collection('users').findOne(query,(err,result)=>{
            if(err) res.send(err );
            res.send(result);
        })
    })
})

app.get('/', (req, res) => {
    connection((db) => {
        db.collection('users').find().toArray((err, data) => {
            res.send(data);
        });
    });
});



app.get('/:id/todos/:tpos', (req, res) => {
    let query = { _id: ObjectID(req.params.id) };
    let tPosition = req.params.tpos;
    connection((db) => {
        db.collection('users').findOne(query, (err, results) => {
            if (err) throw err;
            res.send(results.todoList[tPosition]);
        });
 
    });
 })


app.post('/:id/todos',(req,res)=>{
    connection(db=>{
        db.collection('users').insert(req.body,(err,result)=>{
            if(err) throw err ;
            res.send(result );
        })
    })
})


app.put('/:id/todos/:tPos', (req, res) => {
    var tPosition = req.params.tPos;
    let query = { _id: ObjectID(req.params.id) };
 
    connection((db) => {
        db.collection('users').update(query, {
            $push: {
                "todoList" :req.body,
            },
        }, (err, result) => {
            if (err) throw err;
            res.send(result.todoList);
        });
    });
});


app.delete('/:id/todos/:tPos', (req, res) => {
    var tPosition = req.params.tPos;
    let query = { _id: ObjectID(req.params.id) };
 
    connection((db) => {
        db.collection('users').update(query, {
            $pop: {
                "todoList" :req.body,
            },
        }, (err, result) => {
            if (err) throw err;
            res.send(result.todoList);
        });
    });
});

app.listen(port,(err)=>{
    if(err)throw err;
    console.log('hani nasma3 fik 3al '+port);
})

