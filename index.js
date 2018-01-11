const http = require('http');
const fs =require('fs')
const request = require('request');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/articles';
const dataURL = 'interface.meiriyiwen.com'
const log = console.log

let getData = (date) => {
    request(`https://interface.meiriyiwen.com/article/day?dev=1&date=${date}`, (error, response, body) => {
        body = JSON.parse(body)
        console.log(body.data.title,body.data.author)
        MongoClient.connect(url, body, (err, db) => {
            if (err) throw err
            insertData(db, body, (result) => {
                console.log(result)
                db.close()
            });
        });

    })
}
let insertData = (db, data, callback) => {
    var collection = db.collection('arts');
    collection.insert(data, (err, result) => {
        if (err) {
            console.log('Error:' + err);
            return;
        }else    getData(data.data.date.prev)
        callback(result);
    });
}
getData(20170914)