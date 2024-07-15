const { GoogleAdsApi, enums } = require('google-ads-api');
const { clientId, clientSecret, developerToken, managerCustomerId } = require('../config/env.config');
const { getclient, getAccessToken } = require('./get_client.utils');
const { getCustomer } = require('./get_customer.utils');
const { default: axios } = require('axios');


const googleAdsClient = new GoogleAdsApi({
  client_id: clientId,
  client_secret: clientSecret,
  developer_token: developerToken,
});

async function getCampaigns(refresh_token, customer_id) {
  let campaigns = null;
  let error = null;
  try {
    const customer = googleAdsClient.Customer({
      customer_id: customer_id,
      refresh_token: refresh_token,
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

async function getCampaignMetrics(access_token, customerId) {
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

  const query_2 = `
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
    campaign.id = 21425610194
`;
  const url = `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:search`;
  const requestData = {
    query: query,
    // page_token: "100"
  };
  // let accessToken = await getAccessToken(refreshToken);
  const headers = {
    'Content-Type': 'application/json',
    'developer-token': developerToken,
    'login-customer-id': managerCustomerId,
    'Authorization': `Bearer ${access_token}`
  };

  const options = {
    url: url,
    method: 'POST',
    headers: headers,
    json: requestData
  };

  try {
    const response = await axios.post(url, requestData, {
      headers
    });
    const res2 = await axios.post(url, { query: query_2 }, { headers })
    console.log({ RES2: res2.data.results[0], customer: res2.data.results[0].customer, campaign: res2.data.results[0].campaign });
    if (!response.data.results) {
      metrics = []
      return { metrics, error }
    }
    metrics = response.data.results;
    return { metrics, error }
  } catch (error) {

    console.error('Error fetching campaign metrics:', error.response ? error.response.data : error.message);

    console.log({ Details: error.response ? error.response.data.error.details[0].errors[0].message : error.message });
    let message = error.response ? error.response.data.error.details[0].errors[0].message : error.message;
    return { metrics, error: message }
  }

}

const queryCustomers = async (access_token, customerId) => {
  let customers = null;
  let error = null;
  let query = `
  SELECT 
  customer_client.applied_labels, 
  customer_client.hidden, 
  customer_client.client_customer, 
  customer_client.currency_code, 
  customer_client.descriptive_name, 
  customer_client.id, 
  customer_client.level, 
  customer_client.manager, 
  customer_client.resource_name, 
  customer_client.status, 
  customer_client.test_account, 
  customer_client.time_zone, 
  customer.auto_tagging_enabled, 
  customer.call_reporting_setting.call_conversion_action, 
  customer.call_reporting_setting.call_conversion_reporting_enabled, 
  customer.call_reporting_setting.call_reporting_enabled, 
  customer.conversion_tracking_setting.accepted_customer_data_terms, 
  customer.conversion_tracking_setting.conversion_tracking_id, 
  customer.conversion_tracking_setting.conversion_tracking_status, 
  customer.conversion_tracking_setting.cross_account_conversion_tracking_id, 
  customer.conversion_tracking_setting.enhanced_conversions_for_leads_enabled, 
  customer.video_brand_safety_suitability, 
  customer.tracking_url_template, 
  customer.time_zone, 
  customer.test_account, 
  customer.status, 
  customer.resource_name, 
  customer.remarketing_setting.google_global_site_tag, 
  customer.pay_per_conversion_eligibility_failure_reasons, 
  customer.optimization_score_weight, 
  customer.optimization_score, 
  customer.manager, 
  customer.location_asset_auto_migration_done_date_time, 
  customer.location_asset_auto_migration_done, 
  customer.local_services_settings.granular_license_statuses, 
  customer.local_services_settings.granular_insurance_statuses, 
  customer.image_asset_auto_migration_done_date_time, 
  customer.image_asset_auto_migration_done, 
  customer.id, 
  customer.has_partners_badge, 
  customer.final_url_suffix, 
  customer.descriptive_name, 
  customer.customer_agreement_setting.accepted_lead_form_terms, 
  customer.currency_code, 
  customer.conversion_tracking_setting.google_ads_conversion_customer 
FROM
  customer_client 
WHERE
  customer_client.hidden != TRUE
  `;

  const url = `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:search`;
  const requestData = {
    query: query,
    // page_token: "100"
  };
  // let accessToken = await getAccessToken(refreshToken);
  const headers = {
    'Content-Type': 'application/json',
    'developer-token': developerToken,
    'login-customer-id': managerCustomerId,
    'Authorization': `Bearer ${access_token}`
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

const handleQuery = async (access_token, customerId, query) => {
  try {
    console.log({query});
  console.log({query});
  console.log({access_token, customerId});
  const url = `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:search`;

    const headers = {
      'Content-Type': 'application/json',
      'developer-token': developerToken,
      'login-customer-id': managerCustomerId,
      'Authorization': `Bearer ${access_token}`
    };
    const requestData = {
      query: query,
      // page_token: "100"
    };
    // let res1 = await getCampaignMetrics(access_token, customerId)
    // return res1;
    console.log("hererer", {headers});
    const response = await axios.post(url, requestData, {
      headers
    });
    console.log({THERESPONSE: response, DATA: response?.data, results: response?.data?.results});
    return {data: response.data.results, error: null}
  } catch (error) {
    console.log({ error });
    console.log({DTA: error.response.data, details: error.response.data.error.details});
    return {data: null, error:"Internal Server Error!"}
  }
}
async function ge() { }
module.exports = {
  getCampaignMetrics, getCampaigns, queryCustomers, handleQuery
}