const express = require('express');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

// Inicialitzar Firebase Admin
const serviceAccount = require('./exeloycast-firebase-adminsdk-nae25-11ccb6563a.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://exeloycast.firebaseio.com'
});

// Ruta PUT
app.put('/eloy/castano/guanyador/:data', async (req, res) => {
  const { data } = req.params;
  try {
    const docRef = admin.firestore().collection('mundial22').doc('final22');
    await docRef.update({ data });
    res.status(200).send('S''ha actualitzat la data del document');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al actualitzar la data del document');
  }
});

// Ruta GET
app.get('/eloy/castano/jugadors', async (req, res) => {
  const { jugador } = req.params;
  try {
    const docRef = admin.firestore().collection('mundial22').doc('final22');
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).send('No s''ha trobat el document');
    } else {
      const jugadors = doc.data().info.reduce((acc, curr) => {
        curr.gols.forEach(gol => {
          if (!acc.includes(gol.jugador)) {
            acc.push(gol.jugador);
          }
        });
        return acc;
      }, []);
      res.status(200).send(jugadors);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al l''obtenir els jugador que han marcat algun gol.');
  }
});

// Iniciar servidor
const port = 3020;
app.listen(port, () => {
  console.log('Servidor escoltant en el port :: ' + port);
});
