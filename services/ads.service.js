const { listAccessibleCustomers, selectDefault, getUserAdsAccount } = require("../utils/get_customer.utils");
const {  queryCustomers, handleQuery } = require("../utils/get_ads_data.utils");
const { get_user_refresh_token } = require("../utils/user_utils");
const { getAccessToken } = require("../utils/get_client.utils");


const listCustomers = async (email) => {
    let refresh_token;
    let access_token;
    let data = null;
    let error = null;

    ({ refresh_token, error } = await get_user_refresh_token(email));

    if (error || !refresh_token) {
        error = error ? error : "Error getting refresh token";
        return {data, error};
    }
    
    ({ access_token, error } = await getAccessToken(refresh_token));
    if (error) {
        return {data, error};
    }
    ({customers, error} = await listAccessibleCustomers(access_token))
    return {customers: customers, error};
}

const queryListCustomers = async (email, customerId) => {
    let refresh_token;
    let access_token;
    let data = null;
    let error = null;

    ({ refresh_token, error } = await get_user_refresh_token(email));

    if (error || !refresh_token) {
        error = error ? error : "Error getting refresh token";
        return {data, error};
    }
    
    ({ access_token, error } = await getAccessToken(refresh_token));
    if (error) {
        return {data, error};
    }
     ({customers, error} = await queryCustomers(access_token, customerId))
    return {customers: customers, error};
}

const handleRequestQuery = async(email, account_id, query) => {
    let refresh_token;
    let access_token;
    let data = null;
    let error = null;

    ({ refresh_token, error } = await get_user_refresh_token(email));

    if (error || !refresh_token) {
        error = error ? error : "Error getting refresh token";
        return {data, error};
    }
    
    ({ access_token, error } = await getAccessToken(refresh_token));
    if (error) {
        return {data, error};
    }
     ({data, error} = await handleQuery(access_token, account_id, query))
    return {data, error}
}

const setDefaultAccount = async(user_id, account_id)=> {
    let {user, error} = await selectDefault(user_id, account_id);
    return {user, error};
}

const getAdsAccount = async(user_id) => {
    let {accounts, error} = await getUserAdsAccount(user_id);

    return {accounts, error}
}
module.exports = { listCustomers,  queryListCustomers, handleRequestQuery, setDefaultAccount, getAdsAccount}