const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_SECRET
  }
});

transporter.verify().then(() => {
  console.log(`Ready for send emails`);
})

module.exports = transporter;