const express = require('express');
const morgan =  require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser , checkLogin, checkPatient,checkDoctor,checkAdmin}= require('./middleware/authMiddleware');
const Specialization = require('./models/specialization');
const Appointment = require('./models/appointment');
const Clinic = require('./models/clinic');
const User = require('./models/User');

//Routes:
const pageRoutes = require('./routes/page/page');
const patientRoutes = require('./routes/patient/patient');
const doctorRoutes = require('./routes/doctor/doctor');
const adminRoutes = require('./routes/admin/admin');
//express app
const app=express();

//middleware & static files:
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//register view engine

app.set('view engine','ejs');

var port = process.env.PORT || 3000;

//connect to mongodb & listen for requests
const dbURI='mongodb+srv://nghi:test1234@cluster0.mvd1w.mongodb.net/nghi?retryWrites=true&w=majority';
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(port))
    .catch((err) =>(console.log(err)));

//routes:
app.get('*', checkUser);

app.get('/',(req,res)=>{
    res.render('./main/page/homepage',{title:'Trang chủ'});
})

app.get('/appointment',checkLogin,checkPatient, async (req,res)=>{
    const specializations = await Specialization.find()
    return res.render('./main/patient/appointment',{
      specializations:specializations,
       title:'Đặt lịch'});
    
})
app.get('/adminpage',checkLogin,checkAdmin, async (req,res)=>{
  const specializations = await Specialization.find()
  const allAppointments = await Appointment.find()

  const appointments = await Appointment.find({$or:
    [
        {status:'Đã khám' } ,{status:'Chấp nhận' } ,{status:'Chờ xác nhận' } 
    ]})
    const comAppointments = await Appointment.find({status:'Đã khám'})
  const clinics = await Clinic.find();
  const patient = 'patient';
  const doctor = 'doctor';
  const userpatient = await User.find({role:patient});
  const userdoctor = await User.find({role:doctor});
  const admins = await User.find({role:'admin'});
  return res.render('./main/admin/adminpage',{
    specializations:specializations,allAppointments:allAppointments,
    clinics:clinics,
    userpatient:userpatient,
    userdoctor:userdoctor,
    admins:admins,
    appointments:appointments,
    comAppointments:comAppointments,
    title:'Trang quản lý'})

})

app.get('/doctorpage',checkLogin,checkDoctor,(req,res)=>{
    res.render('./main/doctor/doctorpage',{title:'Trang bác sĩ'})
  
  })



// all broutes
app.use(pageRoutes);
app.use(patientRoutes)
app.use(doctorRoutes)
app.use(adminRoutes)
// 404 page
app.use((req, res) => {
    res.status(404).render('./main/page/404',{title:'Trang không tìm thấy'});
  });