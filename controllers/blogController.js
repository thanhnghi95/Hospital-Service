const Blog = require('../models/User');

const blog_homepage=(req,res)=>{
    res.render('homepage')
}

const login_get=(req,res)=>{
    res.render('login')
}
const register_get=(req,res)=>{
    res.render('register')
}
module.exports = {
    blog_homepage,
    login_get,
    register_get 
    
  }