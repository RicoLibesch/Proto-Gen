import { mailConfig } from '../config/mailConfig';
import nodemailer from 'nodemailer';
import { selectReceiver } from './mailReceiverService';
import { Protocol } from '../models/protocolModel';
import { selectTemplate } from './mailTemplateService';
import Handlebars from 'handlebars';
import { marked } from 'marked';

const transporter = nodemailer.createTransport(mailConfig);

export const sendMail = async (protocol: Protocol): Promise<void> => {
    try {
        const subject: string = await selectTemplate("subject");
        const body: string = await selectTemplate("body");
        
        const compiledSubject = await buildTemplate(subject, protocol);
        const compiledBody = await buildTemplate(body, protocol); 

      const info = await transporter.sendMail({
        from: {
            name: process.env.EMAIL_SENDER_NAME,
            address: process.env.EMAIL_SENDER_MAIL
        },
        to: await selectReceiver(),
        subject: compiledSubject,
        html: compiledBody,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
};

const buildTemplate = async (template: string, protocol: Protocol): Promise<string> => {
    try {
        let start = new Date(protocol.start_timestamp * 1000);
        let end = new Date(protocol.end_timestamp * 1000);
        const optionsDate: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };
        const optionsTime: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "numeric",
            timeZone: "Europe/Berlin",
        };

        const parsedContent: string = await marked(protocol.content);
        console.log(parsedContent);

        const startDate = start.toLocaleDateString("de-DE", optionsDate);
        const startTime = start.toLocaleTimeString("de-DE", optionsTime);
        const endTime = end.toLocaleTimeString("de-DE", optionsTime);

        const attendanceListHtml = Object.entries(protocol.attendanceList)
            .map(([role, users]) => `<b>${role}:</b> ${users.join(', ')}<br/>`)
            .join('');

        const values = {
            date : startDate,
            begin: startTime,
            end: endTime,
            type: protocol.protocol_type,
            content: new Handlebars.SafeString(parsedContent),
            topics: protocol.topics.join(', '),
            link: process.env.EMAIL_BASE_LINK + protocol.id,
            attendees: new Handlebars.SafeString(attendanceListHtml)
        }

        const compiledTemplate = Handlebars.compile(template);
        return compiledTemplate(values);
    } catch (err) {
        console.log(`Error compiling Mail Template: ${err}`);
    }
};

