const express = require ('express');
var fs = require('fs');
const app = express();
const data = require("./data")
var path = require('path');
var uniqid = require('uniqid'); 
app.use(express.json());

app.get('/registration',(req, res) => {
    res.sendFile(path.join(__dirname,'./pages/register.html'));
});

app.get('/login',(req, res) => {
    console.log(data.loggedInUserEmail)
    if(data.loggedInUserEmail === "") {
        res.sendFile(path.join(__dirname,'./pages/login.html'));
    } else {
        res.sendFile(path.join(__dirname,'./pages/dashBoard.html'));
    }
});

app.get('/dashboard',(req, res) => {
    res.sendFile(path.join(__dirname,'./pages/dashBoard.html'));
});

app.get('/settings',(req, res) => {
    res.sendFile(path.join(__dirname,'./pages/userSetting.html'));
});

var loggedInUserEmail = ""


// User Endpoints

app.post('/register', (req, res) => {
// Laver en ny bruger som vil kalde på vores function saveUser
   let newUser = { 
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        products: []
    } 
     data.saveUser(newUser, res)

})

app.post('/updateUser', (req, res) => {
    let newUser = { 
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        products: []
    } 
     data.updateUser(newUser, res)
})

// Endpoint to get all users
app.get('/getAllUsers', (req, res) => {
    data.getAllUsers(res)
})

// Endpoint to get all users
app.get('/getLoggedInUser', (req, res) => {
    data.getLoggedInUser(res);
})

// Endpoint to delete an user
app.delete('/deleteUser', (req, res) => {
    data.deleteUser(res)
})

// Endpoint to update an user
app.post('/updateUser/:userEmail', (req, res) => {
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

// Endpoint to login
app.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    data.login(email, password, res)
    console.log(loggedInUserEmail);
})


// Endpoints to products

app.post('/createProduct', (req, res) => {
     
        let productId = uniqid();

        let newProduct = {
            title: req.body.title,
            category: req.body.category,
            price: req.body.price,
            productId: productId
        };
        data.createProduct(newProduct, res);
});


const PORT = 3000;
app.listen(PORT,() => {
    console.log(`Server is listening on port: ${PORT}`);
    fs.access('./userDB.json', (err) => {
        if(err){
            console.log('creating user database userDB.json')
            const userArray = []
            const jsonArray = JSON.stringify(userArray);

            fs.writeFile('./userDB.json', jsonArray, (err) => {
                if(err){
                    console.log("something went wrong creating DB", err)
                } else {
                    console.log("created database userDB.json")
                }
            })
        } else{
            console.log("server using userDB.json as userdatabase")
        }
    })

    fs.access('./productDB.json', (err) => {
        if(err){
            console.log('creating product database productDB.json')
            const userArray = []
            const jsonArray = JSON.stringify(userArray);

            fs.writeFile('./productDB.json', jsonArray, (err) => {
                if(err){
                    console.log("something went wrong creating DB", err)
                } else {
                    console.log("created database productDB.json")
                }
            })
        } else{
            console.log("server using productDB.json as productdatabase")
        }
    })
});