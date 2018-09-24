const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cake-db/orders.db');

const addNewOrderRouter = express.Router();

addNewOrderRouter.post('/', (req, res) => {
    let body = req.body;
    let reqKeys = Object.keys(body).filter(key => {
       if (body[key] !== '') {
           return key;
       } 
    }).toString();
    let reqValues = Object.keys(body).filter(key => {
       if (body[key] !== '') {
           return key;
       }
    }).map(key => JSON.stringify(body[key].toString()));
    let dbQuery = 'INSERT INTO Orders(' + reqKeys + ') VALUES (' + reqValues + ')';
    db.run(dbQuery, (err) => {
        if (err) {
            return console.log(err.message);
        }
    });
    res.status(201).send();
});

const getEntireDBRouter = express.Router();

getEntireDBRouter.get('/', (req, res) => {
    db.all("SELECT * FROM Orders", (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.status(200).send(rows);
    });
});

const logNodeError = error => {
  if (error) {
    throw error;
  }
};

module.exports = {
    logNodeError: logNodeError,
    addNewOrderRouter: addNewOrderRouter,
    getEntireDBRouter: getEntireDBRouter
};