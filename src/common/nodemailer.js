const nodemailer = require('nodemailer');
module.exports={
async sendEmail(templete, data) {
  try {

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const message = {
      from: ` <${process.env.EMAIL_FROM}>`,
      to: data.to,
      subject: data.subject,
      html: templete
    }

    const info = await transporter.sendMail(message);
    console.log(`Message sent: ${info.messageId}`);
    return {
      success: true,
      message: 'Email sent successfully'
    }
    
  } catch (error) {

    console.log(error, 'Email not sent');
    return {
      success: false,
      message: 'Email not sent'
    }
 }
}
}