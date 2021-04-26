const express = require('express');
//const mongoose = require('mongoose');
const qr = require('qrcode');
const chart= require('chart.js')
const validator = require('validator')
const cors = require('cors');
const mysql = require('mysql');
// const {Event,Guest} = require('./models/model')


//express app
const app =  express();

app.listen('3000',()=>{
    console.log('Server started on port 3000')
})
//connect mongodb database
// const dbURI = 'mongodb+srv://admin:admin123@event-management.o5ing.mongodb.net/event-management?retryWrites=true&w=majority';
// mongoose.connect(dbURI, { useNewUrlParser:true, useUnifiedTopology:true})
//     .then((result)=app.listen(3000))
//     .catch((err)=> console.log(err))

//connect mysql database
const db = mysql.createConnection({
    host: '127.0.0.1',
    user:'root',
    password:'',
    database: 'event_attendance'
}) 
db.connect(err=> {
    if(err) {
        console.log('Connection failed');
    }
    else{
        console.log('connected to db ');
    }
});


//register view engine
app.set('view engine', 'ejs')

//middleware & static files
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.get('/', (req, res)=>{
//     res.render('index',{title: 'Home'});
// });
// app.get('/signup', (req, res)=>{
//     res.render('signup',{title: 'Sign up'});
// });

app.get('/', (req, res)=>{
     res.render('admin/dashboard',{title: 'Home'});
 });

app.get('/dashboard', (req, res)=>{
    let sql = "SELECT * FROM events";
    let query = db.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            res.render('admin/dashboard', {title: 'Dashboard',events:result});
        }
    })
});

app.get('/check-in', (req, res)=>{
    res.render('admin/check-in',{title: 'Check-In'});
});

//events routes
app.get('/events', (req, res)=>{
    let sql = "SELECT * FROM  events";
    let query = db.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            res.render('admin/events', {title: 'Dashboard',events:result});
        }
    })
});

app.get('/add_event', (req, res)=>{
    let sql = "SELECT * FROM events";
    let query = db.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            res.render('admin/add_event',{title: 'Add Event', guests:result});
        }
    })
});

app.post('/events', (req, res)=>{
    let {id,name,date,location,description,status} = req.body;
    let sql = `INSERT INTO events VALUES ('','${name}','${date}','${location}', '${description}', '${status}')`;
    let query = db.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            res.redirect('/events');
        }
    })
    
});

app.delete('/events/:id', (req,res)=>{
    const id = req.params.id;
    let sql = `DELETE FROM events WHERE id = ${id}`;
    let query = db.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            res.json({ redirect: '/events'});
        }
    })
})



//guests routes
app.get('/guests', (req, res)=>{
    let sql = "SELECT * FROM guests";
    let query = db.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            res.render('admin/guests', {title: 'Guests',guests:result});
        }
    })
});
app.get('/add_guest', (req, res)=>{
    let sql = "SELECT * FROM guests";
    let query = db.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            res.render('admin/add_guest', {title:'Add Guest', events:result});
        }
    })
    
});
app.post('/guests',  (req, res)=>{
    let {designation,firstname,lastname,email,profession, mobile} = req.body;
    let sql = `INSERT INTO guests VALUES ('','${designation}','${firstname}','${lastname}', '${email}', '${profession}', '${mobile}')`;
    let query = db.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            res.redirect('/guests');
        }
    })
});
// app.post('/guests',  (req, res)=>{
//     const guest = new Guest({
//      designation:req.body.designation,
//      firstname:req.body.firstname,
//      lastname:req.body.lastname,
//      email:req.body.email,
//      profession:req.body.profession
//     })     
//     req.body.events.forEach(e=>{
//         Event.find(e)
//         .then(result=>{
//             const event = new Event(result)
//             event.save();
//             guest.events.push(event);
//         })
//     })

//     guest.save()
//     .then((result)=>{
//         res.redirect('/guests');
//         console.log(result)})
//     .catch(err=>{ console.log(err)})
   
// });
// app.delete('/guests/:id', (req,res)=>{
//     const id = req.params.id;
//     Guest.findByIdAndDelete(id)
//     .then(result=>{
//         res.json({ redirect: '/guests'});
//     })
//     .catch(err=>console.log(err));
// })


app.get('/invites',(req,res)=>{
    let sql2 = "SELECT * FROM events";
    let query2 = db.query(sql2, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            var events = result; 
            let sql1 = "SELECT * FROM guests";
            let query1 = db.query(sql1, (err,result)=>{
                if(err){
                    throw err;
                }
                else{
                    var guests = result;
                    res.render('admin/invites', {title: 'Invites', guests ,events})
                }
            })
        }
    })
   
    
    
    
});

app.get('/reports', (req, res)=>{
    res.render('admin/reports',{title:'Reports'});
});
    
app.use((req,res)=>{
    res.status(404).render('error',{title:'404'});
});
