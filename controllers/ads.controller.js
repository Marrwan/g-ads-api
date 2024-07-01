const { listCustomers, retrieveCampaignsWithMetrics, getAdsCampaigns, queryListCustomers } = require("../services/ads.service");
const { getAccessToken } = require("../utils/get_client.utils");


const getCustomers = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken || refreshToken === 'undefined') {
            console.log("nonoo");
            return res.status(400).json({ message: "Refresh token is required" });
        }
        // console.log({ BODY: req.body });
        // console.log({ theREFRESH: refreshToken });
        await getAccessToken(refreshToken)
        const { customers, error } = await listCustomers(refreshToken);
        if (error) {
            return res.status(400).json({ message: error });
        }
        // console.log({ customers });
        return res.json({ customers })
    } catch (error) {
        console.log({MESSAGE: error.message}); 
        return res.status(400).json({message:error.message})
    }
}

const getCampaignMetrics = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { refreshToken } = req.body;
        console.log({ customerId, refreshToken });

        if (!refreshToken || refreshToken == "undefined") {
            console.log("AGAIN??");
            return res.status(400).json({ message: "Refresh token is required" });
        }

        const { metrics, error } = await retrieveCampaignsWithMetrics(refreshToken, customerId);
        if (error) {
            return res.status(400).json({ message: error });
        }
        return res.json(metrics);
    } catch (error) {
        console.log(error);
    }
}
const getCustomersQuery = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { refreshToken } = req.body;
        console.log({ customerId, refreshToken });

        if (!refreshToken || refreshToken == "undefined") {
            console.log("AGAIN??");
            return res.status(400).json({ message: "Refresh token is required" });
        }

        const { customers, error } = await queryListCustomers(refreshToken, customerId);
        if (error) {
            return res.status(400).json({ message: error });
        }
        return res.json(customers);
    } catch (error) {
        console.log(error);
    }
}
const getCampaigns = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { refreshToken } = req.body;
        if (!refreshToken || refreshToken == "undefined") {
            return res.status(400).json({ message: "Refresh token is required" });
        }
        const { metrics, error } = await getAdsCampaigns(refreshToken, customerId);
        if (error) {
            return res.status(400).json({ message: error });
        }
        return res.json({ metrics });
    } catch (error) {

    }
}
module.exports = { getCustomers, getCampaignMetrics, getCampaigns, getCustomersQuery } 