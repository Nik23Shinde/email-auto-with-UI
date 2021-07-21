const express = require ('express')
require('./db/mongoose.js')
const EMAIL = require('./models/mailModel.js')
const hbs = require('hbs')
const path = require('path')

const app = express()
const port = process.env.port | 5000
app.use(express.json())

const schedular = require ('node-schedule')
const nodemailer = require('nodemailer')

//Define paths for Express config
const publicdirectory = path.join(__dirname,'./public')
const viewspath = path.join(__dirname,'./template/views')
const partialspath = path.join(__dirname,'./template/partials')

//set handlebar engine and views location
app.set('view engine','hbs')
app.set('views',viewspath)
hbs.registerPartials(partialspath)

//setup static directory to serve
app.use(express.static(publicdirectory))

app.get('', (req,res) => {
    res.render('index',{
        title:'Email Autoation App',
        name:'Nikhil Shinde'
    })
})

app.get('/about',(req,res) => {
    res.render('about',{
        title:'About us :',
        name:'Nikhil Shinde'
    })
})

app.post('/schedulemails',(req,res) => {
    const email = new EMAIL(req.body)
    email.save().then((data) => {
        res.status(200).send(req.body)
    }).catch((err) => {
        res.status(404).send('Couldnt schedule email'+err)
    })
})

app.get('/getmymails/:datestring',(req,res) => {
    const datestring = req.params.datestring

    EMAIL.find({'datestring':datestring}).then((emails) => {
        if(!emails){
            res.send('No emails found')
        }
        res.status(200).send(emails)
    }).catch((err) => {
        res.status(404).send('couldnt fetch emails '+err)
    })

})

app.put('/rescheduleemails/:datestring',async (req,res) => {
    const datestring = req.params.datestring
    
    await EMAIL.findOneAndDelete({'datestring':datestring})

    const email = new EMAIL(req.body)
    email.save().then((data) => {
        res.status(200).send(req.body)
    }).catch((err) => {
        res.status(404).send('Couldnt schedule email'+err)
    })

})

app.delete('/deleteemails/:datestring',(req,res) => {
    const datestring = req.params.datestring
    EMAIL.deleteOne({'datestring':datestring}).then((data) => {
        res.status(200).send('Deleted')
    }).catch((e) => {
        res.status(404).send(e)
    })
})

app.get('/getlistofmails',async (req,res) => {
    const emaillist = await EMAIL.find({})
    try{
        emaillist.forEach((mail)=>{
        res.status(200).send(mail)
    })
    }
    catch(e){
        res.status(404).send(e)
    }
    //console.log(emaillist)
})

app.get('*',(req,res) => {
    res.render('error',{
        title:'404',
        name:'Nikhil Shinde',
        error:'Page Not Found !'
    })
})

app.listen(port,()=>{
    console.log('Server is up and listening at '+port)
})

//***************************************************************************************************************************************


const schedjob = schedular.scheduleJob('25 * * * *',async function(){

    const emaillist = await EMAIL.find({})
    emaillist.forEach((mail) => {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user: mail.from,
                pass: mail.password,
            }
        })
        
        const mailOptions = {
            from : mail.from,
            to : mail.to,
            subject: mail.subject,
            text: mail.message
        }
    
        const mailDate = new Date(mail.datestring)
            const mailMonth = (mailDate.getMonth()+1)
            const mailDay = mailDate.getDate()
            const mailHour = mailDate.getHours()
            const mailMinute = mailDate.getMinutes()
    
            const sched = mailMinute+' '+mailHour+' '+mailDay+' '+mailMonth+' *'
            const schedstring = sched.toString()
    
        
        const job = schedular.scheduleJob(schedstring,function(){
            transporter.sendMail(mailOptions,
                function(error,info){
                if(error){
                    console.log(error);
                }//if
                else{
                    console.log('Email sent : '+info.response);
                    EMAIL.findOneAndDelete({'from':mail.from,'to':mail.to,'datestring':mail.datestring}).then(() => {
                        console.log('Mail deleted successfully !!')
                    }).catch((e) => {
                        console.log(e)
                    })
                }//else
                })
        })    
    })
    })