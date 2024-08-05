const express = require('express');
const { getCustomers, handleRequest, defaultAccountHandler, getAccounts } = require('../controllers/ads.controller');

const router = express.Router();


router.post("/customers", getCustomers)
router.get("/customers", (req,res)=> res.render("ads-account"))
router.get("/customers/:customerId", (req,res)=> res.render("customers"))
// router.post("/customers/:customerId", getCustomersQuery)
router.post("/set_default_account", defaultAccountHandler)
router.post("/handle_ads_request", handleRequest)
router.get("/redirect",  (req,res)=> res.send("WELCOME BACK TO CENTRAL SERVER "))
router.get('/get_accounts/:user_id', getAccounts)
module.exports = router;
