const express = require('express');
const router = express.Router();
const googleUtil = require('../utils/calendar.utils.js');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const logger = require('../utils/logger');

let globalTermini = [];

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

const a = googleUtil.urlGoogle();
logger.info(a);

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

async function checkTimeslot(summary, location, description, startTime, endTime) {
  return new Promise((resolve, reject) => {
    calendar.freebusy.query(
      {
        resource: {
          timeMin: startTime,
          timeMax: endTime,
          items: [{ id: 'primary' }]
        }
      },
      (err, res) => {
        if (err) {
          logger.error('Free Busy Query Error: ', err);
          reject(err);
        }
        const eventArr = res.data.calendars.primary.busy;
        if (eventArr.length === 0) {
          calendar.events.insert(
            {
              calendarId: 'primary',
              resource: {
                summary: summary,
                location: location,
                description: description,
                colorId: 1,
                start: {
                  dateTime: startTime,
                  timeZone: 'Europe/Belgrade'
                },
                end: {
                  dateTime: endTime,
                  timeZone: 'Europe/Belgrade'
                }
              }
            },
            err => {
              if (err) {
                logger.error('Error Creating Calender Event:', err);
                reject(err);
              }
              resolve('Termin je uspesno zakazan.');
            }
          );
        } else if (eventArr.length > 0) {
          let allSlots = [];
          for (let i = 0; i < 24; i++) {
            allSlots.push(new Date(new Date().setHours(i, 0, 0, 0)).toISOString());
          }
          let bookedSlots = eventArr.map(event => new Date(event.start.dateTime).getHours());

          globalTermini = allSlots.filter((slot, index) => !bookedSlots.includes(index));

          resolve('Termin je vec bukiran, ne moze se zakazati. Izaberi drugi slobodni termi:');
        }
      }
    );
  });
}

router.post('/da_li_je_slobodan', async (req, res) => {
  if (!req.body || !req.body.summary || !req.body.location || !req.body.description || !req.body.startTime || !req.body.endTime) {
    return res.status(400).send('Ulazni parametri nisu validni');
  }
  const { summary, location, description, startTime, endTime } = req.body;

  try {
    const message = await checkTimeslot(summary, location, description, startTime, endTime);
    res.status(200).json({ message: message, drugi_slobodni_termini: globalTermini });
    globalTermini = [];
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
