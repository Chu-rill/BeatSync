import nodemailer from "nodemailer";
import fs from "fs/promises";
import handlebars from "handlebars";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_PROVIDER,
      port: Number(process.env.SERVICE_PORT),
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    this.welcomeTemplatePath = path.join(__dirname, "../views/welcome.hbs");
  }

  // Method to read the email template file based on a path
  async readTemplateFile(templatePath) {
    try {
      return await fs.readFile(templatePath, "utf-8");
    } catch (error) {
      throw new Error(`Error reading email template file: ${error}`);
    }
  }

  // Method to send an email without a template
  async sendEmail(email, data) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: data.subject,
        text: data.text || "",
      });
      console.log(`Message sent: ${info.response}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error sending email: ${error.message}`);
      } else {
        console.error("Unknown error occurred while sending email");
      }
    }
  }

  // Method to send an email with the welcome template
  async sendEmailWithTemplate(email, data) {
    try {
      const templateSource = await this.readTemplateFile(
        this.welcomeTemplatePath
      );
      const emailTemplate = handlebars.compile(templateSource);

      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: data.subject,
        html: emailTemplate({
          PlatformName: "BeatSync",
          username: data.username,
          title: "Welcome Email",
        }),
      });

      console.log(`Message sent: ${info.response}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error sending email with template: ${error.message}`);
      } else {
        console.error(
          "Unknown error occurred while sending email with template"
        );
      }
    }
  }
}
