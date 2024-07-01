const { enums } = require("google-ads-api")
const { listAccessibleCustomers, getCustomer } = require("../utils/get_customer.utils");
const { getCampaignMetrics, getCampaigns, queryCustomers } = require("../utils/get_ads_data.utils");


const listCustomers = async (refreshToken) => {
    const {customers, error} = await listAccessibleCustomers(refreshToken)
    return {customers: customers, error};
}

const queryListCustomers = async (refreshToken, customerId) => {
    const {customers, error} = await queryCustomers(refreshToken, customerId)
    return {customers: customers, error};
}
const  retrieveCampaignsWithMetrics = async(refreshToken, customerId) => {
  console.log("SERVICE");
    const {metrics, error} = await getCampaignMetrics(refreshToken, customerId)

    return {metrics, error};
}

const getAdsCampaigns = async(refreshToken, customerId) => {
    const { campaigns, error } = await getCampaigns(refreshToken, customerId)
    return { campaigns, error };
}

module.exports = { retrieveCampaignsWithMetrics, listCustomers, getAdsCampaigns, queryListCustomers}