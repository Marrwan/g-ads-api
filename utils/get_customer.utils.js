const { default: axios } = require("axios");
const { managerCustomerId, developerToken } = require("../config/env.config");
const { getclient, getAccessToken } = require("./get_client.utils");
const { PrismaClient } = require('@prisma/client');


let prisma = new PrismaClient()
const getCustomer = async (customerId, refreshToken) => {
    let error = null;
    let customer = null;

    try {
        let { client, error } = await getclient()
        client.listAccessibleCustomers
        customer = await client.Customer({
            customer_id: customerId,
            refresh_token: refreshToken,
            login_customer_id: "5295907794"
        });
        console.log({ customer });
        return { customer, error };
    } catch (error) {
        console.log("ERROR GETTING CUSTOMER", error);
        return { customer, error };
    }
}

const listAccessibleCustomers = async (access_token) => {
    let customers = null;
    let error = null
    const url = 'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers';

    try {
        // let accessToken = await getAccessToken(refreshToken);
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'developer-token': developerToken
            },
        });
        console.log('Accessible Customers:', response.data);
        customers = response.data.resourceNames;


        return { customers, error };
    } catch (error) {
        console.error('Error fetching accessible customers:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch accessible customers');
    }
    // try {
    //     let { client, error } = await getclient()
    //     if (error) {
    //         return { customers, error }
    //     }
    //     customers = await client.listAccessibleCustomers(refreshToken);
    //     console.log({ customers });
    //     return { customers, error };
    // } catch (error) {
    //     console.log("ERROR LISTING CUSTOMERS", error);
    //     return { customers, error };

    // }
}

const createCustomers = async (email, customers) => {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }
    customers.forEach(async customer => {
        let customerString = customer;
        let customerId = customer.split('/')[1];
        console.log({ customerString, customerId, user });

        await prisma.customer.upsert({
            where: { customerId },
            update: { customerString },
            create: {
                customerId,
                customerString,
                user: {
                    connect: { id: user.id }
                }
            }
        });
    });

};

const selectDefault = async (email, account_id) => {
    let user = await prisma.user.update({where:{email}, data:{
        defaultAccount: account_id
    }})

    return;
}



module.exports = { getCustomer, listAccessibleCustomers, createCustomers, selectDefault }