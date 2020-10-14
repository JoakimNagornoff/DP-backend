import * as functions from 'firebase-functions';
import express = require('express');
import admin = require('firebase-admin');

admin.initializeApp();

const app = express();

app.post('/', async (req, res) => {
    const user = req.body;

    await admin.firestore().collection('Users').add(user);

    res.status(201).send();
})

exports.user = functions.https.onRequest(app);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
