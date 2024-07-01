const { GoogleAdsApi, enums } = require('google-ads-api');
const { clientId, clientSecret, developerToken, managerCustomerId } = require('../config/env.config');
const { getclient, getAccessToken } = require('./get_client.utils');
const { getCustomer } = require('./get_customer.utils');
const { default: axios } = require('axios');
const request = require('request');


const googleAdsClient = new GoogleAdsApi({
  client_id: clientId,
  client_secret: clientSecret,
  developer_token: developerToken,
});

async function getCampaigns(refreshToken, customerId) {
  let campaigns = null;
  let error = null;
  try {
    const customer = googleAdsClient.Customer({
      customer_id: customerId,
      refresh_token: refreshToken,
    });

    const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status
    FROM
      campaign
    ORDER BY
      campaign.id`;

    campaigns = await customer.query(query);
    return { campaigns, error };
  } catch (error) {
    return { campaigns, error }
  }
}

async function getCampaignMetrics(refreshToken, customerId) {
  let metrics = null;
  let error = null;

  const query = `
    SELECT
      customer.conversion_tracking_setting.conversion_tracking_id,
      campaign.id,
      campaign.name,
      campaign_budget.amount_micros,
      campaign.bidding_strategy_type,
      campaign.status,
      campaign.optimization_score,
      campaign.advertising_channel_type,
      metrics.clicks,
      metrics.impressions,
      metrics.all_conversions,
      metrics.interactions,
      metrics.cost_micros,
      metrics.conversions
    FROM
      campaign
    WHERE
      campaign.status = 'ENABLED'
    ORDER BY
      metrics.clicks DESC
    LIMIT
      10
  `;

  const url = `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:search`;
  const requestData = {
    query: query,
    // page_token: "100"
  };
  let accessToken = await getAccessToken(refreshToken);
  const headers = {
    'Content-Type': 'application/json',
    'developer-token': developerToken,
    'login-customer-id': managerCustomerId,
    'Authorization': `Bearer ${accessToken}`
  };

  const options = {
    url: url,
    method: 'POST',
    headers: headers,
    json: requestData
  };

  try {

    // return new Promise((resolve, reject) => {
    //   request(options, (error, response, body) => {
    //     if (error) {
    //       console.error('Error fetching campaign metrics:', error);
    //       reject(new Error('Failed to fetch campaign metrics'));
    //     } else if (response.statusCode >= 400) {
    //       console.error('Error fetching campaign metrics. Status:', response.statusCode, 'Body:', body);
    //       console.log(body.error.details[0].errors);
    //       reject(new Error('Failed to fetch campaign metrics'));
    //     } else {
    //       console.log('Campaign Metrics:', body.results);
    //       resolve(body);
    //     }
    //   });
    // });
    const response = await axios.post(url, requestData, {
      headers
    });
    if (!response.data.results) {
      metrics = []
      return { metrics, error }
    }
    console.log('Campaign Metrics:', response.data.results);

    metrics = response.data.results;
    return { metrics, error }
  } catch (error) {

    console.error('Error fetching campaign metrics:', error.response ? error.response.data : error.message);

    console.log({ Details: error.response ? error.response.data.error.details[0].errors[0].message : error.message });
    let message = error.response ? error.response.data.error.details[0].errors[0].message : error.message;
    return { metrics, error: message }
  }
  
}

const queryCustomers = async (refreshToken, customerId) => {
  let customers = null;
  let error = null;
  const query = `
    SELECT
        customer_client.resource_name,
        customer_client.level,
        customer_client.hidden,
        customer.currency_code,
        customer.descriptive_name,
        customer.time_zone,
        customer.manager
    FROM
        customer_client
    WHERE
        customer_client.hidden != TRUE
    LIMIT
        1000
  `;

  const url = `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:search`;
  const requestData = {
    query: query,
    // page_token: "100"
  };
  let accessToken = await getAccessToken(refreshToken);
  const headers = {
    'Content-Type': 'application/json',
    'developer-token': developerToken,
    'login-customer-id': managerCustomerId,
    'Authorization': `Bearer ${accessToken}`
  };



  try {

   
    const response = await axios.post(url, requestData, {
      headers
    });
    if (!response.data.results) {
      customers = []
      return { customers, error }
    }
    console.log('Customers:', response.data.results);

    customers = response.data.results;
    return { customers, error }
  } catch (error) {

    console.error('Error fetching customers:', error.response ? error.response.data : error.message);

    console.log({ Details: error.response ? error.response.data.error.details[0].errors[0].message : error.message });
    let message = error.response ? error.response.data.error.details[0].errors[0].message : error.message;
    return { customers, error: message }
  }
}
module.exports = {
  getCampaignMetrics, getCampaigns, queryCustomers
}