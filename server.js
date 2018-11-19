const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
const fs = require('fs');
const CronJob = require('cron').CronJob;
const timeStamp = require('date-format');


const { logNodeError, addNewOrderRouter, getEntireDBRouter, getNewOrderIDRouter } = require('./db-utils');

console.log('Server is running...', process.env.PORT || 8080, process.env.IP || '0.0.0.0');

app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0' );

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cake-db/orders.db', (err) => {
    if (err) {
        console.log(err);
    }
    console.log(timeStamp('yyyy.MM.dd hh:mm:ss', new Date()), 'Connected to orders.db!');
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS Clients (client_id INTEGER PRIMARY KEY,name,surname,tel,avatar)", logNodeError);
    db.run("CREATE TABLE IF NOT EXISTS Orders (order_id INTEGER PRIMARY KEY,client_id,cake_type,theme,deadline,desired_weight,desired_value,base_price,diameter,sponges,fillings,cream,delivery,prototype,comments,result_photo,final_weight,final_value)", logNodeError);
});

const backupDB = new CronJob('00 00 03 * * *', () => {
    const filePrefix = () => timeStamp('yyyy-MM-dd', new Date());
    console.log(timeStamp('yyyy.MM.dd hh:mm:ss', new Date()), 'Starting backup...');
    fs.copyFile('./cake-db/orders.db', `./cake-db/backup/orders-${filePrefix()}.db`, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(timeStamp('yyyy.MM.dd hh:mm:ss', new Date()), 'Backup is done.');
    });
}, null, true);

app.use('/add-order', addNewOrderRouter);
app.use('/get-new-order-id', getNewOrderIDRouter);
app.use('/get-db', getEntireDBRouter); 