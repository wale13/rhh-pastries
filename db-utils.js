const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cake-db/orders.db');

const addNewOrderRouter = express.Router();

addNewOrderRouter.post('/', (req, res) => {
    let body = req.body;
    const begin = () => {
        db.get(
            'SELECT client_id FROM Clients WHERE name = $name AND surname = $surname',
            {
                $name: body.name,
                $surname: body.surname
            },
            (err, row) => {
                if (err) {
                    console.log(err);
                    return;
                }
                else if (typeof(row) != 'undefined') {
                    body.client_id = row.client_id;
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
                    db.run(orderQuery, logNodeError);
                    res.status(201).send(JSON.stringify('Order succesfully added!'));
                } else {
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
                    db.run(clientQuery, logNodeError);
                    console.log('Added new client with id:');
                    begin();
                }
                console.log(body.client_id);
            }
        );
    };
    begin();
    
    
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
    console.log(error);
  }
};

module.exports = {
    logNodeError: logNodeError,
    addNewOrderRouter: addNewOrderRouter,
    getEntireDBRouter: getEntireDBRouter
};