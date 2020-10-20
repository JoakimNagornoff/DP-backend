import * as functions from 'firebase-functions';
import * as express from 'express'
import * as admin from 'firebase-admin';
import * as cors from 'cors'
   
const db = admin.firestore();

const projectApp = express()
projectApp.use(cors({ origin: true }));


projectApp.post('/api/create', async (req, res) => {
  const project = req.body
    try {
        await db.collection('Projects').add(project);
        return res.status(201).send();
    } catch (error){
        console.log(error);
        return res.status(500).send(error);
    }
});
//read all projects
projectApp.get('/api/read', (req, res) => {
  (async() => {
    try {
      const query = db.collection('Projects');
      const response = [] as any;
      await query.get().then(querySnapshot => {
        const docs = querySnapshot.docs;
        for(const doc of docs) {
          const selectedProject = {
            id: doc.id,
            project: doc.data()
          };
          response.push(selectedProject);
        }
      });
      return res.status(200).send(response);
    }
    catch(error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
  //read project item
  projectApp.get('/api/read/:projectId', (req, res) => {
    (async() => {
        try {
            const document = db.collection('Projects').doc(req.params.projectId);
            const project = await document.get();
            const response = project.data();
            return res.status(200).send(response);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});
projectApp.put('api/update/:projectId', (req, res) => {
  (async() => {
    try {
      const document = db.collection('Projects').doc(req.params.id);
      await document.update({
        project: req.body.project
      });
      return res.status(200).send();
    }catch(error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
projectApp.delete('/api/delete/:projectId', (req, res) => {
  (async() => {
    try {
      const document = db.collection('Projects').doc(req.params.id);
      await document.delete();
      return res.status(200).send();
    } catch(error) {
      console.log(error);
      return res.status(500).send();
    }
  })();
});
 

export const project = functions.https.onRequest(projectApp);

export * from '../controllers/project'
