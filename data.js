var fs = require('fs');

// Global variable som jeg vil bruge til at forblive logget
// Den er koblet sammen med min login funktion
var loggedInUserEmail = "";


////////////////////////////////
// USER FUNCTIONALITY ///////
////////////////////////////////

// Spørger min if statment om min loggedInUser er lige med et tomt felt
// Hvis feltet ikke er tomt returnere den false og betyder at der er en bruger logget ind
// Hvis feltet er tomt returnere den true og betyder at der ikke er en bruger logget ind
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
        // Efter for loopet finder den en email som stemmer overens med den email jeg er logget ind med
        if(loggedInUserEmail === parsedUsers[i].email) {
            //Efterfulgt finder vi indekset på emailen og splicer den ene user 
            parsedUsers.splice(i, 1);
            found = true
            // Indikere at brugeren nu er logget ud (Slettet)
            loggedInUserEmail = ""
        }
    }
    if (found === true) {
        // found er lige med true stringifyer vi vores array og tilføjer til DB
        const jsonUsers = JSON.stringify(parsedUsers)
        fs.writeFileSync('userDB.json', jsonUsers);
          res.send("User deleted");
    } else {
        res.send("Could not delete user")
    }
}

function login(email, password, res) {
    // Læser vores userDB file som bliver lagt over i vores const variable
    const allUsers = fs.readFileSync('userDB.json');

    // Parser vores json object til et array
    const parsedUsers = JSON.parse(allUsers)
    // Looper igennem vores array til at finde om en bruger eksistere med vores input
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
            // Looper igennem vores array for at finde en email der passer i vores array
            for(var i = 0; i < parsedUsers.length; i++) {
                if(loggedInUserEmail === parsedUsers[i].email) {
                    
                    // Laver opdateret bruger
                    if(user.email == "") {
                        user.email = parsedUsers[i].email;
                    }
                    // De tomme string er det jeg vil opdatere på den nye user
                    // Hvis de forbliver tomme, så forbliver de gamle informationer på useren det samme
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

function logout(res) {
    loggedInUserEmail = ""
    res.send('logged out successfull')
    return;
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

    // Parser json objectet til den type array jeg skal bruge
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
    // Henter alle produkter fra productDB og parser det til et array
    let rawData = fs.readFileSync('productDB.json');
    const parsedData = JSON.parse(rawData);

    // Returnere alle produkter
    res.send(parsedData);
    return;
}

function getAllUsersProducts(res) {
    // Henter alle produkter fra productDB og parser det til et array
    const allProducts = fs.readFileSync('productDB.json');
    const parsedProducts = JSON.parse(allProducts);

    // Variable med vores usersprodukt med et tomt array 
    var usersProducts = [];

    // Loop som finder en email der stemmer overens med userens produkt og pusher alle hans produkter ind i arrayet
    for(let i = 0; i < parsedProducts.length; i++) {
        if(parsedProducts[i].ownerEmail === loggedInUserEmail) {
            usersProducts.push(parsedProducts[i]);
        }
    }

    // Returnere brugerens produkter
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

function updateProduct(updatedProduct, res) {
    updatedProduct.ownerEmail = loggedInUserEmail;

    const allProducts = fs.readFileSync('productDB.json');

    const parsedProducts = JSON.parse(allProducts);
            for(var i = 0; i < parsedProducts.length; i++) {
                if(updatedProduct.productId === parsedProducts[i].productId) {
                    
                    // Laver opdateret bruger
                    if(updatedProduct.title == "") {
                        updatedProduct.title = parsedProducts[i].title;
                    }

                    if(updatedProduct.category == "") {
                        updatedProduct.category = parsedProducts[i].category;
                    }

                    if(updatedProduct.price == "") {
                        updatedProduct.price = parsedProducts[i].price;
                    }

                    // Sletter gammel produkt
                    parsedProducts.splice(i, 1);

                    // Tilføjer opdateret produkt
                    parsedProducts.push(updatedProduct);
                    
                    // Tilføjer produkt array til db
                    const jsonProducts = JSON.stringify(parsedProducts);

                    fs.writeFileSync('productDB.json', jsonProducts);
                }
            }


            const allUsers = fs.readFileSync('userDB.json');
            const parsedUsers = JSON.parse(allUsers);

            for(var i = 0; i < parsedUsers.length; i++) {
                if(loggedInUserEmail === parsedUsers[i].email) {

                    for(var j = 0; j < parsedUsers[i].products.length; j++) {
                        if(parsedUsers[i].products[j].productId === updatedProduct.productId) {

                            parsedUsers[i].products.splice(j, 1);
                            parsedUsers[i].products.push(updatedProduct);
                        }
                    }
                }
            }

            const jsonUsers = JSON.stringify(parsedUsers);
            fs.writeFileSync('userDB.json', jsonUsers);
            
            res.send("Succesfully updated DB");
            return;
}



module.exports = { saveUser, deleteUser, login, updateUser, loggedInUserEmail, createProduct, deleteProduct, getAllProducts, getAllUsersProducts, isLoggedIn,
updateProduct, logout }