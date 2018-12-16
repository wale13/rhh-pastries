const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
const fs = require('fs');
const CronJob = require('cron').CronJob;
const { db, logNodeError, addNewOrderRouter, editOrderRouter, /*getEntireDBRouter,*/ getNewOrderIDRouter, getPageContentRouter, getCakesQtyRouter, getOrderRouter, insertTimeStamp } = require('./db-utils');

console.log(insertTimeStamp(), 'Server is running...', process.env.PORT || 8080, process.env.IP || '0.0.0.0');

app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0' );

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS Clients (client_id INTEGER PRIMARY KEY,name,surname,tel,avatar)", logNodeError);
    db.run("CREATE TABLE IF NOT EXISTS Orders (order_id INTEGER PRIMARY KEY,client_id,cake_type,theme,deadline,desired_weight,desired_value,base_price,diameter,sponges,fillings,cream,delivery,prototype,comments,result_photo,final_weight,final_value,cake_section)", logNodeError);
});

const backupDB = new CronJob('00 00 23 * * *', () => {
    console.log(insertTimeStamp(), 'Starting backup...');
    fs.copyFile('./cake-db/orders.db', `./cake-db/backup/orders-${insertTimeStamp()}.db`, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(insertTimeStamp(), 'Backup is done.');
    });
}, null, true);

app.use('/add-order', addNewOrderRouter);
app.use('/edit-order', editOrderRouter);
app.use('/get-new-order-id', getNewOrderIDRouter);
// app.use('/get-db', getEntireDBRouter);
app.use('/get-page', getPageContentRouter);
app.use('/get-cakes-qty', getCakesQtyRouter);
app.use('/get-order', getOrderRouter);