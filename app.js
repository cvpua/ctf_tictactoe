const express = require('express');
const flags = require('./routes/flags');


const app = express();


//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))



app.use('/',flags);


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));