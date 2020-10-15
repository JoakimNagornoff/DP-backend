import * as functions from 'firebase-functions';
import * as express from 'express'
import * as admin from 'firebase-admin';
import * as cors from 'cors'
   
const db = admin.firestore();

const projectApp = express()
projectApp.use(cors({ origin: true }));


projectApp.post('/api/create', async (req, res) => {
    try {
        await db.collection('Projects').doc(req.body.id).create({Project : req.body.project});
        return res.status(200).send();
    } catch (error){
        console.log(error);
        return res.status(500).send(error);
    }
});
projectApp.get("/api", async (req, res) => {
    const snapshot = await db.collection("Projects").get();
  
    const projectList = [] as any;
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
  
      projectList.push({ id, ...data });
    });
  
    res.status(200).send(JSON.stringify(projectList));
  });


export const project = functions.https.onRequest(projectApp);

export * from '../controllers/project'
