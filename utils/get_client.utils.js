const { GoogleAdsApi, errors } = require('google-ads-api');
const { clientId, clientSecret, developerToken, managerCustomerId } = require('../config/env.config');
const { default: axios } = require('axios');
const qs = require('qs');
// let g = require("googleapis")

const getclient = async () => {
  let client = null;
  let error = null;
  try {
    client = await new GoogleAdsApi({
      client_id: clientId,
      client_secret: clientSecret,
      developer_token: developerToken,
      // login_customer_id: managerCustomerId
    });
    return { client, error };

  } catch (error) {
    console.log("ERROR IN GETTING CLIENT", error);
    return { client, error };
  }
}

async function getAccessToken(refreshToken) {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  };

  try {
    const response = await axios.post(tokenUrl, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    let access_token = response.data.access_token;
    return {access_token, error: null}
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get access token');
  }
}

module.exports = { getclient, getAccessToken };
