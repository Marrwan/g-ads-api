const { authenticate, authCallback } = require("../services/auth.service")


const auth = async (req, res) => {
    try {
        const opn = await import('open');
        const authUrl = await authenticate()
        return res.redirect(authUrl)
        return opn.default(authUrl).catch(err => console.log('Unable to open browser', err));
        res.status(200).json({ authUrl })
    } catch (error) {
        console.log({ error });
    }
}

const callback = async (req, res) => {
    try {
        let { code } = req.query
        const {tokens, user} = await authCallback(code);
        console.log('Refresh Token:', tokens.refresh_token);
        console.log('Access Token:', tokens.access_token);
        // res.send(`Refresh Token: ${tokens.refresh_token}\nAccess Token: ${tokens.access_token}, user ${user}`);
        res.send(`
            <script>
              localStorage.setItem('refreshToken', '${tokens.refresh_token}');
              window.location.href = '/customers';
            </script>
          `);
    } catch (error) {
        console.log({ error });
    }
}
module.exports = { auth, callback }