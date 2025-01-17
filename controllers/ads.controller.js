const { listCustomers, queryListCustomers, handleRequestQuery, setDefaultAccount, getAdsAccount } = require("../services/ads.service");
const { getAccessToken } = require("../utils/get_client.utils");
const { createCustomers } = require("../utils/get_customer.utils");
const { get_user_by_id } = require("../utils/user_utils");

const handleRequest = async (req, res) => {
    let error = null;
    let customers = null;
    let data = null;
    let user;
    let account_id;
    const { user_id, query, type } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "ID of the user is required" });
    }

    ({ user, error } = await get_user_by_id(user_id));
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    let email = user.email;

    if (type == "listAccounts") {
        ({ customers, error } = await listCustomers(email));
        if (error) {
            return res.status(400).json({ message: error });
        }
        await createCustomers(email, customers)
        return res.json({ customers });
    }
    else if (type == "queryCustomers") {
        ({ account_id } = req.body)
        if (!account_id) {
            return res.status(400).json({ message: "Account ID is required" });
        }
        ({ customers, error } = await queryListCustomers(email, account_id));
        if (error) {
            return res.status(400).json({ message: error })
        }
        return res.json({ customers });
    }
    account_id = user.defaultAccount;
    console.log({ email, query, account_id, type });
    if (!account_id) {
        return res.status(400).json({ message: "Default account not set" })
    }

    if (!query) {
        return res.status(400).json({ message: "Query is required" });
    }
    ({ data, error } = await handleRequestQuery(email, account_id, query));
    if (error) {
        return res.status(400).json({ message: error });
    }
    return res.json({ data });


}

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
        console.log({ MESSAGE: error.message });
        return res.status(400).json({ message: error.message })
    }
}

const defaultAccountHandler = async (req, res) => {
    const { user_id, account_id } = req.body;
    if (!account_id) {
        return res.status(400).json({ message: "Account ID is required" })
    }
    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" })
    }
    let { user, error } = await setDefaultAccount(user_id, account_id);
    if (error) {
        return res.status(400).json({ message: error })
    }
    return res.json({ message: "Default account set successfully" })
}

const getAccounts = async (req, res) => {
    const { user_id } = req.params;
    const { accounts, error } = await getAdsAccount(user_id);
    if (error) {
        return res.status(400).json({ message: error });
    }
    return res.json({ accounts });

};

module.exports = { getCustomers, handleRequest, defaultAccountHandler, getAccounts } 