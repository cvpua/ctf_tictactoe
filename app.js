const express = require('express');
const flags = require('./routes/flags');
const session = require('express-session');
const handlebars = require('express-handlebars');
const path = require('path');

const app = express();



// app.set('view engine', 'handlebars');
app.set('view engine', 'hbs');

// app.engine('handlebars', handlebars({
//     layoutsDir: __dirname + '/views/layouts',
//     }));
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    //new configuration parameter
    extname: 'hbs',
    // defaultLayout : 'index'
    partialsDir: __dirname + '/views/partials/'
    }));



//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))
// app.use(session({secret :'mysupersecret',resave: false, saveUninitialized : false}))

app.use('/',flags);

// app.get('/', (req, res) => {
// //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
// res.render('main',{layout: 'index',proPlayer : fakeApi()});
// });


app.use('/public', express.static('public'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));