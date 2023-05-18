const dbclient = require('./dbconnection.js')
const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cors = require('cors');
var fs = require('fs');

if (!fs.existsSync('images')) {
    fs.mkdirSync('images');
}


app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: function (req, file, cb) {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    },
  });


  const session = require('express-session');
  const PgSession = require('connect-pg-simple')(session);

const sessionOptions = {
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new PgSession({              
    pool: dbclient,
    tableName: 'session',
    }),
    cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24,
    },
};

app.use(session(sessionOptions));
app.use('/images', express.static('images'));

app.listen(8080, ()=>{
    console.log("Server is now listening at port 8080");
    //sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
})


dbclient.connect()

