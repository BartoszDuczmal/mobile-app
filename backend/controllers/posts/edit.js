import { promisify } from 'util';
import db from '../../config/db.js';

const query = promisify(db.query).bind(db);

const edit = (req, res) => {
    //TUTAJ SKONCZYLES
}

export default edit;