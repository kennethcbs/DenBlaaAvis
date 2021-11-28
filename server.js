const express = require ('express');
var fs = require('fs');
const app = express();
const data = require("./data")
var path = require('path');
var uniqid = require('uniqid'); 
app.use(express.json());

app.get('/registration',(req, res) => {
    const isLoggedIn = data.isLoggedIn();

    if(isLoggedIn) {
        res.sendFile(path.join(__dirname,'./pages/dashBoardLoggedIn.html'));
    } else {
        res.sendFile(path.join(__dirname,'./pages/register.html'));
    }
});

app.get('/login',(req, res) => {
    const isLoggedIn = data.isLoggedIn();

    if(isLoggedIn) {
        res.sendFile(path.join(__dirname,'./pages/dashBoardLoggedIn.html'));
    } else {
        res.sendFile(path.join(__dirname,'./pages/login.html'));
    }
});

app.get('/dashboard',(req, res) => {
    const isLoggedIn = data.isLoggedIn();

    if(isLoggedIn) {
        res.sendFile(path.join(__dirname,'./pages/dashBoardLoggedIn.html'));

    } else {
        res.sendFile(path.join(__dirname,'./pages/dashBoard.html'));
    }
});

app.get('/settings',(req, res) => {
    const isLoggedIn = data.isLoggedIn();

    if(isLoggedIn) {
        res.sendFile(path.join(__dirname,'./pages/userSetting.html'));

    } else {
        res.sendFile(path.join(__dirname,'./pages/dashBoard.html'));
    }});

app.get('/createProduct',(req, res) => {
    const isLoggedIn = data.isLoggedIn();

    if(isLoggedIn) {
        res.sendFile(path.join(__dirname,'./pages/createProduct.html'));

    } else {
        res.sendFile(path.join(__dirname,'./pages/dashBoard.html'));
}});

app.get('/updateProduct/:productId',(req, res) => {
    const isLoggedIn = data.isLoggedIn();

    if(isLoggedIn) {
        res.sendFile(path.join(__dirname,'./pages/updateProduct.html'));

    } else {
        res.sendFile(path.join(__dirname,'./pages/dashBoard.html'));
}});
////////////////////
// User Endpoints //
////////////////////

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

// Endpoint to delete an user
app.delete('/deleteUser', (req, res) => {
    data.deleteUser(res)
})

// Endpoint to login
app.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    data.login(email, password, res)
})

//Endpoint to logout
app.post('/logout', (req, res) => {

    
    data.logout(res)
})



///////////////////////////
// Endpoints to products //
///////////////////////////

app.post('/createProduct', (req, res) => {
     
        let productId = uniqid();

        let newProduct = {
            title: req.body.title,
            category: req.body.category,
            price: req.body.price,
            productId: productId,
            ownerEmail: ""
        };
        data.createProduct(newProduct, res);
});

app.delete('/deleteProduct', (req, res) => {
    data.deleteProduct(req.body.productId, res);
})

app.get('/getAllProducts', (req, res) => {
    data.getAllProducts(res);
})

app.get('/getAllUsersProducts', (req, res) => {
    data.getAllUsersProducts(res);
})

app.post('/updateProduct', (req, res) => {
    let newProduct = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        productId: req.body.productId,
        ownerEmail: ""
    };

    console.log(newProduct);


    data.updateProduct(newProduct, res);
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