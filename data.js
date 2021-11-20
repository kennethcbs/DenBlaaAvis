var fs = require('fs')

const users = [];


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
                        res.send("Registered user")
                    }
                })
            } else {
                console.log('user already exist')
                res.send("Could not register user")
            }
        }
    })
}

function deleteUser(userEmail, res) {
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
                if(userEmail === parsedUsers[i].email) {
                    parsedUsers.splice(i, 1);
                    found = true
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


function getAllUsers(res) {
    fs.readFile('userDB.json', (error, allUsers) => {
        if(error) {
            console.log('Error getting all users', error)
            res.send('could not get all users')
        } else {
            const parsedUsers = JSON.parse(allUsers)
            console.log('Getting all users succes', allUsers)
            res.send(parsedUsers)
        }
    })
}



module.exports = { saveUser, users, deleteUser, getAllUsers }