const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express ();

app.use(express.static('pages'))

const port = process.env.PORT || 3000;

mongoose.connect('mongodb://0.0.0.0/database');

const registrationSchema = new mongoose.Schema({
    name : String,
    username : String,
    email : String,
    phno : Number,
    password : String,
    confirm : String,
    gender : String,
});

const registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded ({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req, res) => {
    try{
        const {name,username,email,phno,password,confirm,gender} = req.body;

const existingUser = await registration.findOne({email : email });

if (password !== confirm) {
    return res.send('<script>alert("Password and Confirm Password do not match.Please try again."); window.location="/index.html";</script>');
  }

if(!existingUser) {
    const registrationData = new registration({
            name,
            username,
            email,
            phno,
            password,
            confirm,
            gender,
        });
        await registrationData.save(); 
        res.redirect("/success");
    }
    else{
        console.log("User already exist");
        res.redirect("/error");
    }

    }    
    catch (error) {
    console.log(error);
    res.redirect("error");

     }    
});

app.get("/success", (req, res)=>{
    res.sendFile (__dirname+"/pages/success.html");
})
app.get("/error", (req, res)=>{
    res.sendFile (__dirname+"/pages/error.html");
})
app.listen(port, ()=>{
    console.log(`server is running on http://localhost:3000/`);
})