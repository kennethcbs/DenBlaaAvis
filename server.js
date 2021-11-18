const express = require ('express');
var fs = require('fs');
const app = express();
const data = require("./data")
app.use(express.json());

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname,'./public/pages/home.html'));
});


// User Endpoints

app.post('/register', (req, res) => {
    let newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        products: []
    }
    const found = data.users.find((user => user.email === newUser.email))
    if (found) {
        console.log('Cannot create user with this email')
    } else {
        data.users.push(newUser)
        console.log('User was successfully created')
    }
    res.send('register')
})

// Endpoint to get all users
app.get('/getAllUsers', (req, res) => {
    res.send(data.users)
})

// Endpoint to delete an user
app.delete('/deleteUser', (req, res) => {
    const index = data.users.findIndex(user => user.email === req.body.email)

    data.users.splice(index, 1)
    res.send(data.users)
})

// Endpoint to update an user
app.post('/updateUser/:userEmail', (req, res) => {
    const found = data.users.find((user => user.email === req.params.userEmail))
    console.log(req.params.userEmail)

    if (found) {
        const index = data.users.findIndex(user => user.email === req.params.userEmail)
        data.users.splice(index, 1)
        let updatedUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            products: found.products
        }
        data.users.push(updatedUser)

        } else {
        console.log('User could not be found')
    }
    res.send(data.users)
})








const PORT = 3000;
app.listen(PORT,() => {
    console.log(`Server is listening on port: ${PORT}`);
    fs.access('./userDB.txt', (err) => {
        if(err){
            console.log('creating user database userDB.txt')

            fs.open('userDB.txt', 'w', function(err) {
                if(err){
                    console.log("something went wrong creating DB", err)
                } else {
                    console.log("created database userDB.txt")
                }
            })
        } else{
            console.log("server using userDB.txt as userdatabase")
        }
    })
});