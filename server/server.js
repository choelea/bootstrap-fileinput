//to view es6 capabilities see http://node.green/
//node v8-options es6 module syntax currently under development (2016/06/25)
let path         = require('path');
let express      = require('express');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let multer       = require('multer');
const cors       = require('cors');
const fs         = require('fs');
let upload       = multer({ dest: 'uploads/tmp', limits: { fields: 10, fileSize: '20MB', files: 20 } })
let app          = express();

//settings
app.set('port', process.env.PORT || 3000);

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.post('/uploadone', upload.single('image'), (req, res, next) => {
  
  const file = req.file
  const filePath = "uploads/tmp/" + file.filename;
  const targetPath = "uploads/" + file.originalname;
  fs.renameSync(filePath, targetPath);
  
  res.json({ url: 'http://localhost:3000/' + targetPath });
})

// error handler
app.use(function (err, req, res, next) {
  if(err.code && err.code=='LIMIT_FILE_COUNT'){
      console.log(JSON.stringify(err));
      res.status(400).json(err);
  }else{
      console.log(err);
    res.status(500).send('Something broke!')
  }
})
//server
app.listen(app.get('port'), () => console.log('Listening on http://localhost:' + app.get('port')));
