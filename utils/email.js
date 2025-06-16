const nodemailer = require('nodemailer');

async function sendConfirmationEmail(email, code) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Flip-Piece" <no-reply@flip-piece.test>',
    to: email,
    subject: "Your Flip-Piece Confirmation Code",
    text: `Your confirmation code is: ${code}`,
    html: `<b>Your confirmation code is: ${code}</b>`,
  });

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = { sendConfirmationEmail };