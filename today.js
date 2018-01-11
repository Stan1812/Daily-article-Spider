// 使用linux定时任务Crontab
//  * */01 * * * /root/.nvm/versions/node/v8.8.0/bin/node /this file 
const http = require('http')
const fs = require('fs')

const request = require('request')

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/articles'
const dataURL = 'interface.meiriyiwen.com'
const log = console.log

let addlog = (val, addDate = true) => {
    addDate ? val = new Date().toString() + ':\t' + val : val = val + '\n'
    fs.appendFile('article.log', val, (err) => {
        if (err) {
            return console.error(err)
        }
        console.log("日志已记录")
    })
}

let getData = (date) => {
    request(`https://interface.meiriyiwen.com/article/day?dev=1&date=${date}`, (error, response, body) => {
        body = JSON.parse(body)
        console.log(body.data.title, body.data.author)
        addlog(`<${body.data.title}>\t${body.data.author}\t`)
        MongoClient.connect(url, body, (err, db) => {
            if (err) throw err
            insertData(db, body, (result) => {
                console.log(result)
                addlog(`数据存储:${JSON.stringify(result.result)}`, false)
                db.close()
            })
        })

    })
}
let insertData = (db, data, callback) => {
    let collection = db.collection('arts')
    collection.insert(data, (err, result) => {
        if (err) {
            console.log('Error:' + err)
            addlog(err,false)
            return
        } else
            callback(result)
    })
}
let getNowFormatDate = () => {
    let date = new Date()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = "0" + month
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate
    }
    let currentdate = date.getFullYear() + month + strDate
    return currentdate
}
getData(getNowFormatDate())
