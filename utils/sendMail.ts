import Nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import { send } from "process";

interface EmailOption {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}
// sendMail function
const sendMail = async (options: EmailOption): Promise<void> => {
  const transporter: Transporter = Nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const { email, subject, template, data } = options;

  //get the path to the email template file
  const templatePath = path.join(__dirname, "../view", template);
  //render the email template with ejs
  const html = await ejs.renderFile(templatePath, data);
  //send the email
  await transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  });
};

export default sendMail;
