const emailform = document.querySelector('form')
const subbutton = document.querySelector('#submit')
const rescbutton = document.querySelector('#resc')
const delbutton = document.querySelector('#del')
const getbutton = document.querySelector('#getdetails')

const userid = document.querySelector('#uid')
const from = document.querySelector('#from')
const password = document.querySelector('#password')
const to = document.querySelector('#to')
const subject = document.querySelector('#subject')
const message = document.querySelector('#message')
const date = document.querySelector('#date')
const time = document.querySelector('#time')

const messageone = document.querySelector('#m1')
const messagetwo = document.querySelector('#m2')
const messagethree = document.querySelector('#m3')
const messagefour = document.querySelector('#m4')
const messagefive = document.querySelector('#m5')
const messagesix = document.querySelector('#m6')

const msgone = document.querySelector('#n1')
const msgtwo = document.querySelector('#n2')
const msgthree = document.querySelector('#n3')
const msgfour = document.querySelector('#n4')
const msgfive = document.querySelector('#n5')
const msgsix = document.querySelector('#n6')



subbutton.addEventListener('click',(e) => {
    e.preventDefault()
    const datestring = date.value.toString()
    const timestring = time.value.toString()
    const datetime = datestring+':'+timestring
    messageone.textContent='Loading..'

    let email={
        "userid": userid.value,
        "from":from.value,
        "password":password.value,
        "to":to.value,
        "subject":subject.value,
        "message":message.value,
        "datestring":datetime,
    }

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(email)
    }

    fetch('/schedulemails').then((response) => {
        response.json().then((data) => {

        if(data.Error)
        {
              messageone.textContent=data.Error
        }
        else
        {
            messageone.textContent=data.userid
            messagetwo.textContent=data.from
            messagethree.textContent=data.to
            messagefour.textContent=data.subject
            messagefive.textContent=data.message
            messagesix.textContent=data.datestring

        }
    })
})
})


rescbutton.addEventListener('click',(e) => {
    e.preventDefault()

})

delbutton.addEventListener('click',(e) => {
    e.preventDefault()

})

getbutton.addEventListener('click',(e) => {
    e.preventDefault()
    const datestring = date.value.toString()
    const timestring = time.value.toString()
    const datetime = datestring+':'+timestring
    messageone.textContent='Loading..'


    fetch('/getlistofmails').then((response) => {
        response.json().then((data) => {

        if(data.Error)
        {
              msgone.textContent=data.Error
        }
        else
        {
            data.forEach(item => {
                msgone.textContent=item.userid
                msgtwo.textContent=item.from
                msgthree.textContent=item.to
                msgfour.textContent=item.subject
                msgfive.textContent=item.message
                msgsix.textContent=item.datestring
    
            })

        }
    })
})

})
