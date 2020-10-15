import * as functions from 'firebase-functions';
import * as express from 'express'
import * as admin from 'firebase-admin';
import * as serviceAccount from '../permissions.json';
import * as cors from 'cors';
const params = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url
  }
     
  admin.initializeApp({
    credential: admin.credential.cert(params)
  })    
const db = admin.firestore();

const userApp = express();
userApp.use(cors({ origin: true }));
//get user list
userApp.get("/", async (req, res) => {
    const snapshot = await db.collection("Users").get();
  
    const users = [] as any;
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
  
      users.push({ id, ...data });
    });
  
    res.status(200).send(JSON.stringify(users));
  });
//get user by id
userApp.get('/:id', async (req, res) => {
    const snapshot = await db.collection('Users').doc(req.params.id).get();

    const userId = snapshot.id;
    const userData = snapshot.data();

    res.status(200).send(JSON.stringify({userId, ...userData}));
});
//add user
userApp.post('/', async (req, res) => {
    const user = req.body;

    await db.collection('Users').add(user);

    res.status(201).send();
})
//change user info
userApp.put('/:id', async (req, res ) => {
    const body = req.body;

    await db.collection('Users').doc(req.params.id).update(body);

    res.status(200).send();
});

//delete user
userApp.delete('/:id', async (req, res) => {
    await db.collection('Users').doc(req.params.id).delete();

    res.status(200).send();
})

export const user = functions.https.onRequest(userApp);

export * from '../controllers/user'