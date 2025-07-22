import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const checkFunc = (token) => {

    if(!token) {
        return null
    }
    try {   
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        console.log('Zdekodowany: ', decoded)
        return decoded.email
    }
    catch(err) {
        return null;
    }

}

export default checkFunc;