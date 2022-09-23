import nodemailer from "nodemailer";

const emailProcessor = async (emailData) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: +process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail(emailData);

  console.log("Message sent: %s", info.messageId);
  //preview only available when sending through an Ethereal account
  console.log("Preview URL : %s", nodemailer.getTestMessageUrl(info));
};

//userInfo should have email, fName
export const otpNotification = async (userInfo) => {
  const mailBody = {
    from: `" CRM Ticketing 💻 " ${process.env.EMAIL_USER}`, // sender address
    to: userInfo.email, // list of receivers
    subject: "OTP request notification", // Subject line
    text: `Hi there, here is the OTP as per your request ${userInfo.token}, If it wasn't you, please contact administration immediately`, // plain text body
    html: `<p>Hi there,</p>
          <br/>
          <br/>
          here is the OTP as per your request ${userInfo.token}
          <br/>
          <br/>
  kind regards,
  CRM ticketing team
          `, // html body
  };

  emailProcessor(mailBody);
};
