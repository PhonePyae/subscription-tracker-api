import { emailTemplates } from './email-template.js'
import dayjs from 'dayjs'
import transporter, { accountEmail } from '../config/nodemailer.js'

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if (!to || !type) throw new Error('Missing required parameters');

  // Find the email template that matches the given type
  const template = emailTemplates.find((t) => t.label === type);
  if (!template) throw new Error('Invalid email type');

  // Construct the email content with relevant subscription details
  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  };

  // Generate the email subject and body from the template
  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  // Define mail options for sending the email
  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  };

  // Send the email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error, 'Error sending email');
    
    console.log('Email sent: ' + info.response);
  });
};
