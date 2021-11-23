var fs = require('fs');

const users = [];

var loggedInUserEmail = "";
console.log(loggedInUserEmail)
console.log("hej")


function saveUser(user, res) {
    // Vi går ind og læser i vores json fil
    fs.readFile('userDB.json', (error, allUsers) => { 
        // Hvis der opstår en fejl returnere den false til vores variable succes
        if(error) { 
            console.log("error reading from file", error) 
        } else {
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
                fs.writeFile("./userDB.json", jsonUsers, (error) => {
                    if(error) {
                        console.log('something went wrong writing to file', error);
                    } else {
                        res.status(200).send(true);
                    }
                })
            } else {
                console.log('user already exist')
                res.status(404).end()
            }
        }
    })
}

function deleteUser(res) {
    // Find user
    fs.readFile('userDB.json', (error, allUser) => {
        if(error) {
            console.log("could not delete user", error)
            res.send('could not delete user')
        } else {
            const parsedUsers = JSON.parse(allUser)
            let found = false

            for (var i = 0; i < parsedUsers.length; i++) {
                console.log(parsedUsers[i].email)
                if(loggedInUserEmail === parsedUsers[i].email) {
                    parsedUsers.splice(i, 1);
                    found = true
                    loggedInUserEmail = ""
                }
            }
            if (found === true) {
                const jsonUsers = JSON.stringify(parsedUsers)
                fs.writeFile("./userDB.json", jsonUsers, (error) => {
                    if(error) {
                        console.log('something went wrong writing to file', error);
                        res.send("Could not delete user")

                    } else {
                        res.send("User deleted")
                    }
                })
            } else {
                res.send("Could not delete user")
            }
        } 
      
    })
}

function login(email, password, res) {
    fs.readFile('userDB.json', (error, allUsers) => {
        if(error) {
            console.log('Error trying to login', error)
            res.send('couldnt login')
            return;
        } else {
            const parsedUsers = JSON.parse(allUsers)
            for(var i = 0; i < parsedUsers.length; i++) {
                if (email === parsedUsers[i].email && password === parsedUsers[i].password) {
                    res.send("login successfull")

                    // Setter logged in bruger
                    loggedInUserEmail = email;
                    console.log(loggedInUserEmail)
                    return
                } 
            }
            res.status(404).end()
            return;
        }
    })
}


function updateUser(user, res) {
    fs.readFile('userDB.json', (error, allUsers) => {
        if(error) {
            res.send("Could not update user");
            return;
        } else {
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
                    fs.writeFile('userDB.json', jsonUsers, (error) => {
                        if(error) {
                            console.log("Could not update user");
                            res.send("Could not update user");
                            return;
                        } else {
                            console.log("Succesfully updated user");
                            res.send("Succesfully updated user");
                            return;
                        }
                    })
                }
            }
            
        }
            return;

    })
}

// Product functionality 

function createProduct (newProduct, res) {

    fs.readFile('userDB.json', (error, allUsers) => {
        if(error) {
            res.status(401).end();
            return;
        } else {
            var parsedUsers = JSON.parse(allUsers);
            for(var i = 0; i < parsedUsers.length; i++) {
                if(loggedInUserEmail === parsedUsers[i].email) {
                    parsedUsers[i].products.push(newProduct)
                    const jsonUser = JSON.stringify(parsedUsers);
                    fs.writeFile('userDB.json', jsonUser, (error) => {
                        if(error) {
                            res.status(401).end()
                            return;
                        } 
                    })
                   
                } 
            }
        }
    })

    fs.readFile('productDB.json', (error, allProducts) => {
        if(error) {
            res.status(401).end();
            return;
        } else {
            const parsedProducts = JSON.parse(allProducts);
            parsedProducts.push(newProduct)

            const jsonProducts = JSON.stringify(parsedProducts)

            fs.writeFile('./productDB.json', jsonProducts, (error) => {
                if(error) {
                    res.status(401).end();
                    return;
                } else {
                    res.send('Successfully created product');
                    return;
                }
            })
        }
     })
}



module.exports = { saveUser, users, deleteUser, login, updateUser, loggedInUserEmail, createProduct }