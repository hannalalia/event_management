const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name:{
        type: String
        // required:true
    },
    date:{
        type: String
        // required:true
    },
    location:{
        type: String
        // required:true
    },
    description:{
        type: String
        // required:true
    },
    guests:[{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Guest'
    }],
    status:{
        type:String
        // required:true
    }
}, {timestamps:true});

const guestSchema = new Schema({
    designation:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
        // unique:true
    },
    profession:{
        type:String,
        required:true
    },
    // affiliations:[{
    //     type:String,
    //     required:true
    // }],
    events:[{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Event'
    }]
})

const Event = mongoose.model('Event', eventSchema);
const Guest = mongoose.model('Guest',guestSchema);
module.exports = {Event, Guest};