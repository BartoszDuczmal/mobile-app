import { Resend } from 'resend'
import dotenv from 'dotenv';

dotenv.config();

const mail = new Resend(process.env.RESEND_API_KEY);

export default mail;