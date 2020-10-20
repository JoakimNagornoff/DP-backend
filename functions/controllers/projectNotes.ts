import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as cors from 'cors';


const db = admin.firestore();

const projectNoteApp = express();

projectNoteApp.use(cors({ origin : true}));

projectNoteApp.get('/', async (req, res) => {
    const snapshot = await db.collection('ProjectNotes').get();

    const projectNoteList = [] as any;
    snapshot.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();

        projectNoteList.push({id, ...data});
    });
    res.status(200).send(JSON.stringify(projectNoteList));
});

projectNoteApp.get('/:id', async (req, res) => {
    const snapshot = await db.collection('ProjectNotes').doc(req.params.id).get();

    const noteId = snapshot.id;
    const noteData = snapshot.data();

    res.status(200).send(JSON.stringify({noteId, ...noteData}));
});


projectNoteApp.get('/', async (req, res) => {
    const note = req.body;

    await db.collection('ProjectNotes').add(note);

    res.status(201).send();
});

projectNoteApp.delete('/:id', async (req, res) => {
    await db.collection('ProjectNotes').doc(req.params.id).delete();

    res.status(200).send();
});

export const projectNote = functions.https.onRequest(projectNoteApp);

