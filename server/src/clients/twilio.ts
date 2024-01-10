// send twilio programmable sms
import { Twilio } from "twilio";

type SendSMSParam = {
  to: string;
  body: string;
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_PHONE_NUMBER;

const client = new Twilio(accountSid, authToken);

export class TwilioClient {
  public static async sendVerificationSMS({ to, body }: SendSMSParam) {
    try {
      const message = await client.messages.create({
        body,
        from,
        to
      });
      console.log("Message response-----)",message);
      return message;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
