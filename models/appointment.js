const mongoose = require('mongoose');
const User = require('./User');
const medicalForm = require('./medicalForm');
const moment = require('moment-timezone');

const dateVietNam = moment.tz(Date.now(), "Asia/Tokyo");
const appointmentSchema = new mongoose.Schema({
    fullname:String,
    phone:String,
    birthday:Date,
    gender:String,
    service:String,
    address:String,
    appointmentday:{
        type: Date,
        default: dateVietNam 
    },
    note:String,
    user_id:{
        type: mongoose.Schema.ObjectId,
        ref:User,
        required:true,
        index:true
    },
    doctor_id:{
        type: mongoose.Schema.ObjectId,
        ref:User,
        required:true,
        index:true
    },

    status:String
},{ timestamps: true });

const Appointment = mongoose.model('appointments', appointmentSchema );
module.exports = Appointment;