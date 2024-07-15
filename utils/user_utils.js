const { PrismaClient } = require("@prisma/client");

let prisma = new PrismaClient();

const get_user_by_email = async (email) => {
    let user = null;
    let error = null;
    try {
        user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = null;
            error = `User With email ${email} not found, reauthenticate`
            return { user, error }
        }
        return {user, error}
    } catch (error) {
        return { user, error }
    }
}  
 
const get_user_by_id = async (id) => {
    let user = null;
    let error = null;
    try {
        user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            user = null;
            error = `User With id ${id} not found, reauthenticate`
            return { user, error }
        }
        return {user, error}
    } catch (error) {
        return { user, error }
    }
}

const get_user_refresh_token = async (email) => {
    let refresh_token = null;
    let error = null;
    try {

        user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            refresh_token = null;
            error = `User With email ${email} not found, reauthenticate`

            return { refresh_token, error }
        }
        refresh_token = user.refreshToken;

        if (!refresh_token) {
            refresh_token = null;
            error = `User With email ${email} not found, reauthenticate`
            return { refresh_token, error }
        }
        return { refresh_token, error }
    } catch (error) {
        return { refresh_token, error }
    }


}



module.exports = { get_user_by_email, get_user_by_id, get_user_refresh_token }