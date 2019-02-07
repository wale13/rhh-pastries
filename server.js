const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
const fs = require('fs');
const CronJob = require('cron').CronJob;
const { checkOrdersDB, addNewOrderRouter, editOrderRouter, deleteOrderRouter, 
        getClientsCakesRouter, getNewOrderIDRouter, getPageContentRouter, 
        getCakesQtyRouter, getOrderRouter, insertDateStamp, insertTimeStamp, 
        getAdminPageContentRouter, getSectionsRouter, getClientRouter, 
        getClientsListRouter, editClientRouter } = require('./db-utils');
const passport = require('./passport.js');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/login');
const backupDB = new CronJob('00 00 23 * * *', () => {
    console.log(insertTimeStamp(), 'Starting backup...');
    fs.copyFile(`${process.env.DB_PATH}orders.db`, 
                `${process.env.DB_PATH}backup/orders-${insertDateStamp()}.db`, 
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log(insertTimeStamp(), 'Backup is done.');
                });
}, null, true);

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.SECRET,
                                     resave: false,
                                     saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/add-order', addNewOrderRouter);
app.use('/edit-order', editOrderRouter);
app.use('/delete-order', deleteOrderRouter);
app.use('/get-new-order-id', getNewOrderIDRouter);
app.use('/get-page', getPageContentRouter);
app.use('/get-admin-page', getAdminPageContentRouter);
app.use('/get-cakes-qty', getCakesQtyRouter);
app.use('/get-order', getOrderRouter);
app.use('/get-client', getClientRouter);
app.use('/edit-client', editClientRouter);
app.use('/get-clients-list', getClientsListRouter);
app.use('/client-cakes', getClientsCakesRouter);
app.use('/get-sections', getSectionsRouter);

app.get('/', 
    (req, res) => res.redirect('./index.html'));

app.route('/login')
    .get((req, res) => res.redirect('./login.html'))
    .post(passport.authenticate('local', 
        { successReturnToOrRedirect: '/admin', failureRedirect: '/login' }));

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')});

app.get('/admin*',
    ensureLoggedIn,
    (req, res) => {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.sendFile(__dirname + process.env.ADMIN_PAGE);
    });

app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0' );

console.log(insertTimeStamp(), 'Server is running...', 
            process.env.PORT || 8080, process.env.IP || '0.0.0.0');
            
checkOrdersDB();