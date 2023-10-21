const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const app = express();
const server = http.createServer(app);
const corsMiddle = require('./Middleware/cors');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const filePathMiddleware = require('./Middleware/filepath.middleware');
const path = require('path');

const PORT = process.env.PORT || config.get('serverPort');

const fileRouter = require('./Router/file.routes');
const authRouter = require('./Router/auth.routes');

app.use(fileUpload({}));
app.use(corsMiddle);
app.use(filePathMiddleware(path.resolve(__dirname, 'files')))
app.use(express.json());
app.use(cors());
app.use(express.static('static'));

app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);

const start = async () => {
    try {
        await mongoose.connect(config.get('dbUrl'));
        server.listen(PORT, () => console.log('Server running on port 5000'));
    } catch (error) {
        console.log(error);
    }
};

start();