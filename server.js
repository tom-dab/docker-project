const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || 'demo-service';

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
        level: 'info',
        service: SERVICE_NAME,
        method: req.method,
        path: req.path,
        timestamp
    }));
    next();
});

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: SERVICE_NAME,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Endpoint principal
app.get('/hello', (req, res) => {
    const name = req.query.name || 'World';
    res.json({
        message: `Hello ${name} from Docker!`,
        service: SERVICE_NAME,
        hostname: require('os').hostname(),
        timestamp: new Date().toISOString()
    });
});

// Endpoint pour simuler une erreur (pour les logs)
app.get('/error', (req, res) => {
    console.error(JSON.stringify({
        level: 'error',
        service: SERVICE_NAME,
        message: 'Simulation d\'erreur',
        timestamp: new Date().toISOString()
    }));
    res.status(500).json({ error: 'Une erreur simulée s\'est produite' });
});

// Endpoint pour simuler une latence
app.get('/slow', async (req, res) => {
    const delay = parseInt(req.query.delay) || 2000;
    const start = Date.now();
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    res.json({
        message: 'Requête lente terminée',
        delay: `${delay}ms`,
        actualTime: `${Date.now() - start}ms`,
        service: SERVICE_NAME
    });
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(JSON.stringify({
        level: 'info',
        service: SERVICE_NAME,
        message: `Service démarré sur le port ${PORT}`,
        port: PORT,
        timestamp: new Date().toISOString()
    }));
});
