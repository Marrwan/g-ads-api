const express = require('express');
const { OAuth2Client } = require('google-auth-library');


const { clientId, clientSecret, redirectUri } = require('../config/env.config');

const { google } = require('googleapis');
const { PrismaClient } = require('@prisma/client');

// const { PrismaClient } = require('@prisma/client');
let prisma = new PrismaClient()

const oauth2Client = new OAuth2Client(
    clientId,
    clientSecret,
    redirectUri
);

const authenticate = async (id) => {
    const newUser = await prisma.user.create({ data: { id } });
    console.log({ newUser });
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/adwords',
            // 'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            // "openid"

        ],
        prompt: 'consent',
        state: id
    });
    return authUrl;
}

const authCallback = async (code, state) => {
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);
    await oauth2Client.setCredentials(tokens);
    const email = (await oauth2Client.getTokenInfo(tokens.access_token)).email;
    console.log({ email });
    // Save user details in the database
    // user = email
    const user = await prisma.user.upsert({
        where: { id:state },
        update: {email, refreshToken: tokens.refresh_token, accessToken: tokens.access_token },
        create: {
            email,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            id: state

        }, 
    });
    return { tokens, user, email }
}




module.exports = {
    authCallback, authenticate
}