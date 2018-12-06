const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const timeStamp = require('date-format');

const db = new sqlite3.Database('./cake-db/orders.db', (err) => {
    if (err) {
        console.log(err);
    }
    console.log(timeStamp('yyyy.MM.dd hh:mm:ss', new Date()), 'Connected to orders.db!');
});

const logNodeError = error => {
  if (error) {
    console.log(error);
  }
};

const addNewOrderRouter = express.Router();

addNewOrderRouter.post('/', (req, res) => {
    console.log(timeStamp('yyyy.MM.dd hh:mm:ss', new Date()), 'Received some new order...');
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
                    let onlyOrderKeys = Object.keys(body).filter(key => {
                        if (key !== 'name' && key !== 'surname' && key !== 'tel' && key !== 'avatar' && body[key] !== '') {
                            return key;
                        } 
                    });
                    let orderKeys = onlyOrderKeys.toString();
                    let orderValues = onlyOrderKeys.map(key => JSON.stringify(body[key].toString()));
                    let orderQuery = 'INSERT INTO Orders(' + orderKeys + ') VALUES (' + orderValues + ')';
                    db.run(orderQuery, function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        res.status(201).send(JSON.stringify(`Order # ${this.lastID} successfully added!`));
                        console.log(timeStamp('yyyy.MM.dd hh:mm:ss', new Date()), 'Added new order # ' + this.lastID);
                    });
                } else {
                    let onlyClientKeys = Object.keys(body).filter(key => {
                        if (key == 'name' || key == 'surname' || key == 'tel' || key == 'avatar' && body[key] !== '') {
                            return key;
                        } 
                    });
                    let clientKeys = onlyClientKeys.toString();
                    let clientValues = onlyClientKeys.map(key => JSON.stringify(body[key].toString()));
                    let clientQuery = 'INSERT INTO Clients(' + clientKeys + ') VALUES (' + clientValues + ')';
                    db.run(clientQuery, logNodeError);
                    console.log(timeStamp('yyyy.MM.dd hh:mm:ss', new Date()), 'Added new client: ' + body.name + ' ' + body.surname);
                    addNewOrder();
                }
            }
        );
    };
    addNewOrder();
});

const getEntireDBRouter = express.Router();

getEntireDBRouter.get('/', (req, res) => {
    db.all("SELECT * FROM Orders INNER JOIN Clients ON Orders.client_id = Clients.client_id", (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        res.status(200).send(rows);
    });
});

const getNewOrderIDRouter = express.Router();

getNewOrderIDRouter.get('/', (req, res) => {
    db.get("SELECT rowid from Orders ORDER BY rowid DESC LIMIT 1", (err, row) => {
        let newOrderID;
        if (err) {
            console.log(err);
            return;
        }
        else (typeof(row) === 'undefined' ? newOrderID = 1 : newOrderID = row.order_id + 1);
        res.status(200).send(JSON.stringify(newOrderID));
    });
});

const getCakesQtyRouter = express.Router();

getCakesQtyRouter.get('/', (req, res) => {
    db.get("SELECT count(*) FROM Orders", (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        res.status(200).send(JSON.stringify(rows));
    });
});

const getPageContentRouter = express.Router();

getPageContentRouter.post('/', (req, res) => {
    const query = `SELECT * FROM Orders INNER JOIN Clients ON Orders.client_id = Clients.client_id ORDER BY Orders.rowid DESC LIMIT ${req.body.offset}, ${req.body.limit}`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        res.status(200).send(rows);
    });
});

module.exports = {
    logNodeError: logNodeError,
    addNewOrderRouter: addNewOrderRouter,
    getEntireDBRouter: getEntireDBRouter,
    getNewOrderIDRouter: getNewOrderIDRouter,
    getCakesQtyRouter: getCakesQtyRouter,
    getPageContentRouter: getPageContentRouter,
    sqlite3: sqlite3,
    db: db
};