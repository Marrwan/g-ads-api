const { listCustomers } = require("../services/ads.service");
const { authenticate, authCallback } = require("../services/auth.service");
const { createCustomers } = require("../utils/get_customer.utils");


const auth = async (req, res) => {
    try {
        const {user_id} = req.query;
        if(!user_id){
            return res.status(400).json({message: "user_id is required"})
        }
        const authUrl = await authenticate(user_id)
        return res.redirect(authUrl)
    } catch (error) {
        console.log({ error });
    }
}

const callback = async (req, res) => {
    try {
        let { code, state } = req.query
        const {tokens, user, email} = await authCallback(code, state);
        let { customers, error } = await listCustomers(email);
        createCustomers(email, customers)
        // Redirect to central server here
        return res.redirect("/redirect");
        // res.send(`
        //     <script>
        //       localStorage.setItem('refreshToken', '${tokens.refresh_token}');
        //       localStorage.setItem('email', '${email}');
        //       localStorage.setItem('uuid', '${user.id}');
        //       window.location.href = '/customers';
        //     </script>
        //   `);
    } catch (error) {
        console.log({ error });
    }
}
module.exports = { auth, callback }