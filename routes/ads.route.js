const express = require('express');
const { getCustomers, getCampaignMetrics, getCampaigns, getCustomersQuery } = require('../controllers/ads.controller');

const router = express.Router();


router.post("/customers", getCustomers)
router.get("/customers", (req,res)=> res.render("ads-account"))
router.get("/customers/:customerId", (req,res)=> res.render("customers"))
router.post("/customers/:customerId", getCustomersQuery)
router.get("/campaigns_metrics/:customerId", (req,res)=> res.render("campaigns"))
router.post("/campaigns_metrics/:customerId", getCampaignMetrics)
router.get("/campaigns/:customerId", getCampaigns)

module.exports = router;
