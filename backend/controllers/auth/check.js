import dotenv from 'dotenv';
import checkFunc from '../../functions/checkFunc.js';

dotenv.config();

const check = (req, res) => {
    const token = req.cookies.token

    const checked = checkFunc(token)

    if(checked === null) {
        console.log('Błąd autoryzacji!')
        return res.status(401).json('Błąd autoryzacji!')
    }
    console.log('Zdekodowano: ' + checked)
    res.json({ success: true, user: checked })
}

export default check;