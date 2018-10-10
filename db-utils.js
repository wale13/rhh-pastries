const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cake-db/orders.db');

const addNewOrderRouter = express.Router();

addNewOrderRouter.post('/', (req, res) => {
    let body = req.body;
    let clientId;
    const begin = ()=>{db.all(
            'SELECT client_id FROM Clients WHERE name = $name AND surname = $surname',
            {
                $name: body.name,
                $surname: body.surname
            },
            (err, row)=>{
                if (err) {
                    console.log(err);
                    return;
                }
                else if (row[0]) {
                    clientId = row[0].client_id;
                } else {
                    clientId = 0;
                }
                console.log(clientId);
            }
    )};
    begin();
    if (clientId === 0) {
        console.log('trying to write to Client table');
        let clientKeys = Object.keys(body).filter(key => {
            if (key == 'name' || key == 'surname' || key == 'tel' || key == 'avatar' && body[key] !== '') {
                return key;
            } 
        }).toString();
        let clientValues = Object.keys(body).filter(key => {
            if (key == 'name' || key == 'surname' || key == 'tel' || key == 'avatar' && body[key] !== '') {
                return key;
            }
        }).map(key => JSON.stringify(body[key].toString()));
        let clientQuery = 'INSERT INTO Clients(' + clientKeys + ') VALUES (' + clientValues + ')';
        db.run(clientQuery, err => {
            if (err) {
                console.log(err);
            }
        });
        begin();
        // db.all(
        //     'SELECT client_id FROM Clients WHERE name = $name AND surname = $surname',
        //     {
        //         $name: body.name,
        //         $surname: body.surname
        //     },
        //     (err, row)=>{
        //         if (err) {
        //             console.log(err);
        //             return;
        //         }
        //         if (row[0]) {
        //             clientId = row[0].client_id;
        //         }
        //     }
        // );
    }
    let orderKeys = Object.keys(body).filter(key => {
        if (key !== 'name' && key !== 'surname' && key !== 'tel' && key !== 'avatar' && body[key] !== '') {
            return key;
        } 
    }).toString();
    let orderValues = Object.keys(body).filter(key => {
        if (key !== 'name' && key !== 'surname' && key !== 'tel' && key !== 'avatar' && body[key] !== '') {
            return key;
        }
    }).map(key => JSON.stringify(body[key].toString()));
    let orderQuery = 'INSERT INTO Orders(' + orderKeys + ') VALUES (' + orderValues + ')';
    db.run(orderQuery, err => {
        if (err) {
            console.log(err);
        }
    });
    res.status(201).send();
});

const getEntireDBRouter = express.Router();

getEntireDBRouter.get('/', (req, res) => {
    db.all("SELECT * FROM Clients", (err, rows) => {
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