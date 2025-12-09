import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const checkFunc = (token) => {

    if(!token) {
        return null
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        return { id: decoded.id, perm: decoded.perm }
    }
    catch(err) {
        return null;
    }

}

export default checkFunc;