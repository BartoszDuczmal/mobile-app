import { ApiClient, TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

// 1. Konfiguracja klienta
const defaultClient = ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.MAIL_KEY;

const apiInstance = new TransactionalEmailsApi();

const sendMail = async ({ to, subject, htmlContent }) => {
  // 2. Tworzenie obiektu email
  const sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.sender = { 
    email: process.env.MAIL_ADRESS,
    name: process.env.MAIL_NAME
  };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, data };
  } catch (error) {
    // Brevo wyrzuca szczegóły błędu w error.response.body
    const errorDetail = error.response?.body || error.message;
    console.error('Błąd Brevo API:', errorDetail);
    return { success: false, error: errorDetail };
  }
};

export default sendMail;