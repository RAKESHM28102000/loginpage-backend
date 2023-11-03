// require('dotenv').config();
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import _ from 'lodash';
import bcrypt from 'bcrypt';
const saltRounds=10;
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));



mongoose.set('strictQuery', true);
//mongoose connection to mongodb
const uri=process.env.MONGODB_CONNECTION;
mongoose.connect(uri);


const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});
const Schema = mongoose.Schema;
//signup
const userSchema = new Schema({
  name: { type: String, required: true },
  email:{ type: String, required:  true },
  password:{ type: String, required:  true },
}, {
  timestamps: true,
});
const UserSignup=mongoose.model("UserSignup",userSchema);

//profile
const userProfile = new Schema({
  name: { type: String, required: true },
  email:{ type: String, required:  true },
  age:{ type: Number, required:true },
  gender:{ type: String, required:  true },
  dob:{ type: String, required:  true },
  mobileno:{ type: Number, required:true }
}, {
  timestamps: true,
});
const Userprofile=mongoose.model("Userprofile",userProfile);
//login
// const loginSchema=new mongoose.Schema({
//   email:{ type: String, required:  true },
//   password:{ type: String, required:  true }
// });

// const Login=new mongoose.model("Login",loginSchema);



app.post('/api/signup', (req, res) => {
  const {name,email,password,confirmPassword} = req.body;
  const registeredPassword=password;
  bcrypt.hash(registeredPassword, saltRounds ,function(err,hash){
  const newUser=new UserSignup({
    name:name,
    email:email,
    password:hash
  });
  newUser.save()
  .then(() => {
    console.log("saved successfully")
      res.status(201).json({ message: 'User registered  signup successfully' });
})
.catch((err) => {
  console.log(err);
  res.status(404).json({ message: 'error' });
});
  });

});

app.post('/api/login',(req, res) => {
  const registeredPassword = req.body.password;
  UserSignup.findOne({email:req.body.email})
  .then((foundedUser) => {
    if(foundedUser){
      console.log(foundedUser);
      bcrypt.compare(registeredPassword,foundedUser.password,function(err,result){
       if (!err && result===true){
       res.status(201).json({ message: 'User registered login successfully' });}
       });
   }  
 })
 .catch((error) => {
      console.log(error);
     res.send(400, "Bad Request");
 });
});

app.get('/api/profile', (req, res) => {
  Userprofile.find({})
  .then((foundeditems)=>{
   
      res.json({ message: 'profile successful',foundeditems});

  })
  .catch((err)=>{
    return res.status(401).json({ message:err });
  })
});

app.post('/api/profile', (req, res) => {
  const {name,email,age,gender,dob,mobileno} = req.body;

  const newprofile=new Userprofile({
    name:name,
    email:email,
    age:age,
    gender:gender,
    dob:dob,
    mobileno:mobileno,
    
  });
  newprofile.save()
  .then(() => {
    console.log("saved successfully")
      res.status(201).json({ message: 'User registered  signup successfully' });
})
.catch((err) => {
  console.log(err);
  res.status(404).json({ message: 'error' });
});
  });




app.get('/api/profile/:id', (req, res) => {
  Userprofile.findById({_id:req.params.id})
  .then((foundeditems)=>{
   
      res.json({ message: 'profile successful',foundeditems});

  })
  .catch((err)=>{
    return res.status(401).json({ message:err });
  })
});

app.put('/api/profile/:id', (req, res) => {
  const update ={...req.body};
  Userprofile.findOneAndUpdate({_id:req.params.id}, update)
  .then(()=>{
    res.json({ message: 'Profile updated successfully' });
  })
  .catch((err)=>{
    return res.status(401).json({ message:err });
  })


});
app.delete('/api/delete/:id',(req,res)=>{
  Userprofile.deleteOne({_id:req.params.id})
  .then(()=>{
    res.json({ message: 'Profile deleted successfully' });
  })
  .catch((err)=>{
    return res.status(401).json({ message:err });
  })

})

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
