const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
const fs = require('fs');
const CronJob = require('cron').CronJob;
const { checkOrdersDB, addNewOrderRouter, editOrderRouter, 
        getNewOrderIDRouter, getPageContentRouter, getCakesQtyRouter, 
        getOrderRouter, insertTimeStamp, insertDateStamp } = require('./db-utils');

console.log(insertTimeStamp(), 'Server is running...', 
            process.env.PORT || 8080, process.env.IP || '0.0.0.0');

checkOrdersDB();

app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0' );

const backupDB = new CronJob('00 00 23 * * *', () => {
    console.log(insertTimeStamp(), 'Starting backup...');
    fs.copyFile('./cake-db/orders.db', 
                `./cake-db/backup/orders-${insertDateStamp()}.db`, 
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log(insertTimeStamp(), 'Backup is done.');
                });
}, null, true);

app.use('/add-order', addNewOrderRouter);
app.use('/edit-order', editOrderRouter);
app.use('/get-new-order-id', getNewOrderIDRouter);
app.use('/get-page', getPageContentRouter);
app.use('/get-cakes-qty', getCakesQtyRouter);
app.use('/get-order', getOrderRouter);