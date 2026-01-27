const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.MAIL_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Funkcja wysyłająca
const sendMail = async ({ to, subject, htmlContent }) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

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
    const errorDetail = error.response ? error.response.body : error.message;
    console.error('Błąd Brevo API:', errorDetail);
    return { success: false, error: errorDetail };
  }
};

module.exports = sendMail;