const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const {BadRequestError, NotFoundError} = require('./utils/errors');

const app = express();

//enables cross origin resource sharing for all origins
app.use(cors());
//parse incoming request bodies w json payloads
app.use(express.json());
//log request info
app.use(morgan('tiny'));

app.use((req, res, next) => {
    return next(new NotFoundError())
})

app.use((error, req, res, next) => {
    const status = error.status || 500
    const message = error.message

    return res.status(status.json({error: {message, status}}))
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 server running http://localhost:${PORT}`);
})