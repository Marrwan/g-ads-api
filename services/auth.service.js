const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const { clientId, clientSecret, redirectUri } = require('../config/env.config');

const { google } = require('googleapis');
// const { PrismaClient } = require('@prisma/client');
// let prisma = new PrismaClient()
// const oauth2Client = new google.auth.OAuth2(
//     clientId,
//     clientSecret,
//     redirectUri
// );

// let f = req.protocol + '://' + req.get('host');
const oauth2Client = new OAuth2Client(
    clientId,
    clientSecret,
    redirectUri
);

const authenticate = async () => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/adwords',
            // 'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            // "openid"

        ],
        prompt: 'consent'
    });
    // console.log('Please go to this url and authorize:', authUrl);
    return authUrl;
}

const authCallback = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);
    await oauth2Client.setCredentials(tokens);
    const email = (await oauth2Client.getTokenInfo(tokens.access_token)).email;

    
    console.log({ email });
    // Save user details in the database
    user = email
    // const user = await prisma.user.upsert({
    //     where: { email },
    //     update: { refreshToken: tokens.refresh_token, accessToken: tokens.access_token },
    //     create: {
    //         email,
    //         accessToken: tokens.access_token,
    //         refreshToken: tokens.refresh_token,

    //     },
    // });
    return { tokens, user }
}




module.exports = {
    authCallback, authenticate
}