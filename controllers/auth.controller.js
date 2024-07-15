const { authenticate, authCallback } = require("../services/auth.service")


const auth = async (req, res) => {
    try {
        const {id} = req.query;
        if(!id){
            return res.status(400).json({message: "id is required"})
        }
        const authUrl = await authenticate(id)
        return res.redirect(authUrl)
    } catch (error) {
        console.log({ error });
    }
}

const callback = async (req, res) => {
    try {
        let { code, state } = req.query
        console.log({code, state});
        const {tokens, user, email} = await authCallback(code, state);
        console.log('Refresh Token:', tokens.refresh_token);
        console.log('Access Token:', tokens.access_token);
        // res.send(`Refresh Token: ${tokens.refresh_token}\nAccess Token: ${tokens.access_token}, user ${user}`);
        res.send(`
            <script>
              localStorage.setItem('refreshToken', '${tokens.refresh_token}');
              localStorage.setItem('email', '${email}');
              localStorage.setItem('uuid', '${user.id}');
              window.location.href = '/customers';
            </script>
          `);
    } catch (error) {
        console.log({ error });
    }
}
module.exports = { auth, callback }