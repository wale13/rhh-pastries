const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cake-db/orders.db');

const logNodeError = error => {
  if (error) {
    console.log(error);
  }
};

const addNewOrderRouter = express.Router();

addNewOrderRouter.post('/', (req, res) => {
    console.log('Received some new order...');
    let body = req.body;
    const addNewOrder = () => {
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
                    db.run(orderQuery, function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        res.status(201).send(JSON.stringify(`Order # ${this.lastID} successfully added!`));
                        console.log('Added new order # ' + this.lastID);
                    });
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
                    console.log('Added new client: ' + body.name + ' ' + body.surname);
                    addNewOrder();
                }
            }
        );
    };
    addNewOrder();
});

const getEntireDBRouter = express.Router();

getEntireDBRouter.get('/', (req, res) => {
    console.log('Received query to get entire DB...');
    db.all("SELECT * FROM Orders INNER JOIN Clients ON Orders.client_id = Clients.client_id", (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        res.status(200).send(rows);
        console.log("Entire DB was sent successfully!");
    });
});

const getNewOrderIDRouter = express.Router();

getNewOrderIDRouter.get('/', (req, res) => {
    console.log("Received query to get new order id");
    db.get("SELECT rowid from Orders order by ROWID DESC limit 1", (err, row) => {
        let newOrderID;
        console.log(row);
        if (err) {
            console.log(err);
            return;
        }
        else (typeof(row) === 'undefined' ? newOrderID = 1 : newOrderID = row.order_id + 1);
        res.status(200).send(JSON.stringify(newOrderID));
        console.log(`New order ID (${newOrderID}) was sent.`);
    });
});

module.exports = {
    logNodeError: logNodeError,
    addNewOrderRouter: addNewOrderRouter,
    getEntireDBRouter: getEntireDBRouter,
    getNewOrderIDRouter: getNewOrderIDRouter
};