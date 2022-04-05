const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const { salvarSeguro, listarSeguro, listarSeguros } = require('./seguro-service');

const webpush = require('web-push');

// VAPID keys should be generated only once.
const vapidKeys = {
    publicKey: 'BNfPGiMiFmYjEacv6oEKZREjO0kbTlqLWLSy2T4DhiN41swFah8fomzh2JUTgVHdFwbfTaU3AQvzmr0A-IKj5a8',
    privateKey: '8I5RaD5J13bHuBdQggpWMFGxLsf1m3z3z0WXS45JOdA'
}

//console.log(vapidKeys) <= usou para pegar as chaves

webpush.setVapidDetails(
    'teste@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

app.route('/api/seguros').post(salvarSeguro);
app.route('/api/seguros').get(listarSeguros);

const HOST = 'localhost';
const PORT = 9400;

const httpServer = app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});