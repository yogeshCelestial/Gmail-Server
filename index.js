const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 5000;
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/requests");
const composeRouter = require("./routes/compose");
const threadsRouter = require('./routes/threads');
const messageRouter = require('./routes/message');

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.use('/oauth', authRouter);
app.use('/request', requestRouter);
app.use('/compose', composeRouter);
app.use('/threads', threadsRouter);
app.use('/thread', messageRouter);

app.listen(port, () => {
    console.log('Listening on ', port);
});

