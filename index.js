const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/articles';
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log('数据库已创建');
    var dbase = db.db("articles");
    dbase.createCollection('arts', function (err, res) {
        if (err) throw err;
        console.log("创建集合!");
        db.close();
    });
});