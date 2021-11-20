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
// Laver en ny bruger som vil kalde på vores function saveUser
   let newUser = { 
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        products: []
    } 
    data.saveUser(newUser, res)

})

// Endpoint to get all users
app.get('/getAllUsers', (req, res) => {
    data.getAllUsers(res)
})

// Endpoint to delete an user
app.delete('/deleteUser/:userEmail', (req, res) => {
    data.deleteUser(req.params.userEmail, res)
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
});