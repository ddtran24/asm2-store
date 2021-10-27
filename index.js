var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app .listen(3000);

const mongoose = require('mongoose');

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
const uri = "mongodb+srv://duytran-24:emday123@cluster0.4tjoe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })


require('./Models/toys');



//body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//Models
var toys = require("./Models/toys");
 
//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpg"|| file.mimetype=="image/jpeg"|| file.mimetype=="image/gif") {
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("toysImage");

app.get("/add", function(req, res){
    res.render("add");
});

app.post("/add", function(req, res){
    
    //Upload file
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          res.json({"kq":0, "errMsg":"A Multer error occurred when uploading."}); 
        } else if (err) {
          res.json({"kq":0, "errMsg":"An unknown error occurred when uploading." + err}); 
        }else{
            //save mogo (req.file.filename)
           var toys = Toys({
                Name: req.body.txtName,
                Image: req.file.filename,
                Price: req.body.txtPrice
            });
            toys.save(function(err){
                if(err){
                    res.json({"kq":0, "errMsg":err}); 
                }else{
                    res.json({"kq":1}); 
                }
            });
        }

    });

});

