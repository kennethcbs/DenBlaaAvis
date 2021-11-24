var fs = require('fs');

const users = [];

var loggedInUserEmail = "";


////////////////////////////////
// USER FUNCTIONALITY ///////
////////////////////////////////

function isLoggedIn() {
    if(loggedInUserEmail === "") {
        return false;
    } else {
        return true;
    }
}

function saveUser(user, res) {
    // Vi går ind og læser i vores json fil
    const allUsers = fs.readFileSync('userDB.json');

     // Parser users i json til et array 
     const parsedUsers = JSON.parse(allUsers)
     // Laver en let variable til at være false som vi bruger senere
     let found = false;

     // Laver et for loop som kører igennem alle objecter med users indtil i er større end parsedUsers
 
     for (var i = 0; i < parsedUsers.length; i++) {
         if (user.email === parsedUsers[i].email) {
             // Laver en let variable til at være true hvis den finder en email der stemmer overens med parsedUsers
             found = true;
         }
     }
     // Hvis found er false går vi ind i vores if statement
     if (!found) {
         // Vi pusher vores user ind i vores array
         parsedUsers.push(user)
         // Laver vores array om til en json object 
         const jsonUsers = JSON.stringify(parsedUsers)
         // Sender vores json object ind i vores json fil 
        fs.writeFileSync('userDB.json', jsonUsers);
        res.status(200).send(true);
        } else {
                console.log('user already exist')
                res.status(404).end()
        }
}

function deleteUser(res) {

    const allUsers = fs.readFileSync('userDB.json');

    const parsedUsers = JSON.parse(allUsers)
    let found = false

    for (var i = 0; i < parsedUsers.length; i++) {
        if(loggedInUserEmail === parsedUsers[i].email) {
            parsedUsers.splice(i, 1);
            found = true
            loggedInUserEmail = ""
        }
    }
    if (found === true) {
        const jsonUsers = JSON.stringify(parsedUsers)

        fs.writeFileSync('userDB.json', jsonUsers);
          res.send("User deleted");
    } else {
        res.send("Could not delete user")
    }
}

function login(email, password, res) {
    const allUsers = fs.readFileSync('userDB.json');

    const parsedUsers = JSON.parse(allUsers)
    for(var i = 0; i < parsedUsers.length; i++) {
        if (email === parsedUsers[i].email && password === parsedUsers[i].password) {
            res.send("login successfull")

            // Setter logged in bruger
            loggedInUserEmail = email;
            return
        } 
    }
    res.status(401).end()
    return;
}


function updateUser(user, res) {
    const allUsers = fs.readFileSync('userDB.json');

    const parsedUsers = JSON.parse(allUsers);
            for(var i = 0; i < parsedUsers.length; i++) {
                if(loggedInUserEmail === parsedUsers[i].email) {
                    
                    // Laver opdateret bruger
                    if(user.email == "") {
                        user.email = parsedUsers[i].email;
                    }

                    if(user.password == "") {
                        user.password = parsedUsers[i].password;
                    }

                    if(user.username == "") {
                        user.username = parsedUsers[i].username;
                    }

                    // Sletter gammel bruger
                    parsedUsers.splice(i, 1);

                    // Tilføjer opdateret bruger
                    parsedUsers.push(user);
                    
                    // Tilføjer bruger array til db
                    const jsonUsers = JSON.stringify(parsedUsers);

                    fs.writeFileSync('userDB.json', jsonUsers);
                    
                    res.send("Succesfully updated user");
                    return;
                }
            }
            res.status(401).end();
}

////////////////////////////////
// PRODUCT FUNCTIONALITY ///////
////////////////////////////////

// Create Product
function createProduct (newProduct, res) {
    // Sætter produkts emailOwner til at være ham der er logget ind
    newProduct.ownerEmail = loggedInUserEmail;

    // Henter alle users
    const allUsers = fs.readFileSync('userDB.json');

    // Bruger denne variable til at teste om produktet blev gemt hos brugere succesfull
    var saveProductInUserSucess = false;

    // Parser alle brugene til js objekt
    var parsedUsers = JSON.parse(allUsers);

    // Finder den rigtige user og lægger produktet i users products array
    for(var i = 0; i < parsedUsers.length; i++) {
        if(loggedInUserEmail === parsedUsers[i].email) {
            parsedUsers[i].products.push(newProduct)
            const jsonUser = JSON.stringify(parsedUsers);
            fs.writeFileSync('userDB.json', jsonUser);

            // Sætter variablen til true da det lykkede at lægge produktet over i useren
            saveProductInUserSucess = true;
        }
    } 

    // Hvis det lykkede at gemme produktet hos brugere, gå videre med at lægge produktet i productDB.json
    if (saveProductInUserSucess === false) {
        console.log('dfjdkfjdkfj')
        res.status(401).end()
        return;
    } else  {
        // Henter alle produkter
        const allProducts = fs.readFileSync('productDB.json');

        // Parser produkter fra json til js objektet
        const parsedProducts = JSON.parse(allProducts);

        // Putter produktet i array listet
        parsedProducts.push(newProduct)

        // Laver array om til json
        const jsonProducts = JSON.stringify(parsedProducts)

        // Skriver produktet over til productDB.json
        fs.writeFileSync('productDB.json', jsonProducts);

        // Sender respond
        res.send("Created Product")
        return;
    }
}

function getAllProducts(res) {
    let rawData = fs.readFileSync('productDB.json');
    const parsedData = JSON.parse(rawData);

    res.send(parsedData);
    return;
}

function getAllUsersProducts(res) {
    const allProducts = fs.readFileSync('productDB.json');
    const parsedProducts = JSON.parse(allProducts);

    var usersProducts = [];

    for(let i = 0; i < parsedProducts.length; i++) {
        if(parsedProducts[i].ownerEmail === loggedInUserEmail) {
            usersProducts.push(parsedProducts[i]);
        }
    }

    res.send(usersProducts);
    return;

}

function deleteProduct(productId, res) {
    let saveProductInDB = false;

    // Henter alle produkter
    const allProducts = fs.readFileSync('productDB.json');

    // Parser alle produkter til js
    const parsedProducts = JSON.parse(allProducts);

    // Finder produktet i db og fjerner det
    for(var i = 0; i < parsedProducts.length; i++) {
        // Ser om det er det rigtige produkt
        if(productId === parsedProducts[i].productId) {

            // Fjerne produktet fra arrayet
            parsedProducts.splice(i, 1);
            
            // Laver arrayet om til JSON
            const jsonProducts = JSON.stringify(parsedProducts);

            // Skriver det nye array til db
            fs.writeFileSync('productDB.json', jsonProducts);
            saveProductInDB = true;
        }
    }

    if (saveProductInDB === false) {
        res.status(401).end()
        return;
    } else {
        // Henter alle useres
        const allUsers = fs.readFileSync('userDB.json');

        // Parser alle brugerene til js
        var parsedUsers = JSON.parse(allUsers);

        // Finder den rigtige bruger og fjerner produktet hos useren
        for(var i = 0; i < parsedUsers.length; i++) {
            // Ser om det er den rigtige user
            if(loggedInUserEmail === parsedUsers[i].email) {

                // Ser igennem alle  userens produkter
                for(var j = 0; j < parsedUsers[i].products.length; j++) {
                    // Tjekker om det er det her produkt der skal fjernes
                    if(productId ===  parsedUsers[i].products[j].productId) {

                        // Fjerner produktet hos useren
                        parsedUsers[i].products.splice(j, 1);

                        //Laver arrayet om til json
                        const jsonUsers = JSON.stringify(parsedUsers);

                        // Skriver arrayet til db
                        fs.writeFileSync('userDB.json', jsonUsers);
                        res.send("Deleted product sucess");
                        return;
                    }
                }
            } 
        }
        res.status(401).end()
        return;
    } 
}

function updateProduct(product, res) {
    const allProducts = fs.readFileSync('userDB.json');

    const parsedProducts = JSON.parse(allProducts);
            for(var i = 0; i < parsedProducts.length; i++) {
                if(product.productId === parsedProducts[i].productId) {
                    
                    // Laver opdateret bruger
                    if(product.title == "") {
                        product.title = parsedProducts[i].title;
                    }

                    if(product.category == "") {
                        product.category = parsedProducts[i].category;
                    }

                    if(product.price == "") {
                        product.price = parsedProducts[i].price;
                    }

                    // Sletter gammel bruger
                    parsedProducts.splice(i, 1);

                    // Tilføjer opdateret bruger
                    parsedProducts.push(product);
                    
                    // Tilføjer bruger array til db
                    const jsonProducts = JSON.stringify(parsedProducts);

                    fs.writeFileSync('userDB.json', jsonProducts);
                    
                    res.send("Succesfully updated product");
                    return;
                }
            }
            res.status(401).end();
}



module.exports = { saveUser, users, deleteUser, login, updateUser, loggedInUserEmail, createProduct, deleteProduct, getAllProducts, getAllUsersProducts, isLoggedIn,
updateProduct }