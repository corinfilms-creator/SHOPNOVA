
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const Product = require('./models/product');
const Order = require('./models/order');
const User = require('./models/user');

const app = express();
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/shopnova');

// Seed sample products
app.get('/seed', async (req,res)=>{
 await Product.deleteMany({});
 await Product.insertMany([
  {name:"Mini Blender", price:29.99, image:"https://via.placeholder.com/200"},
  {name:"LED Lights", price:19.99, image:"https://via.placeholder.com/200"}
 ]);
 res.send("Seeded");
});

app.get('/', async (req,res)=>{
 const products = await Product.find();
 res.render('index',{products});
});

app.get('/product/:id', async (req,res)=>{
 const product = await Product.findById(req.params.id);
 res.render('product',{product});
});

app.get('/admin', async (req,res)=>{
 const orders = await Order.find();
 res.render('admin',{orders});
});

app.get('/login',(req,res)=>res.render('login'));
app.get('/register',(req,res)=>res.render('register'));

app.post('/register', async (req,res)=>{
 const hash = await bcrypt.hash(req.body.password,10);
 await new User({email:req.body.email,password:hash}).save();
 res.redirect('/login');
});

app.post('/login', async (req,res)=>{
 const user = await User.findOne({email:req.body.email});
 if(!user) return res.send("No user");
 const valid = await bcrypt.compare(req.body.password,user.password);
 if(!valid) return res.send("Wrong password");
 res.redirect('/');
});

app.post('/order', async (req,res)=>{
 await new Order({
  customerEmail:"test@email.com",
  items:req.body.cart,
  status:"paid"
 }).save();
 res.send("Order placed");
});

app.listen(3000,()=>console.log("Running on http://localhost:3000"));
