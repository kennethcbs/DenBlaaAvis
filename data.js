var fs = require('fs')

const users = [];


function saveUser(user) {
    let allUsers = getAllUsers()
    if(allUsers !== undefined) {
        allUsers.push(user);
        let jsonUsers = JSON.stringify(allUsers)
        console.log("hej")

        fs.writeFile('userDB.txt', jsonUsers, function(error) {
            if(error) {
                console.log(error)
            }
            console.log("Succesfull saved user")
        })
    } else {
        const users = []
        users.push(user)
        let jsonUsers = JSON.stringify(users)

        fs.writeFile('userDB.txt', jsonUsers, function(error) {
            if(error) {
                console.log(error)
            }
            console.log("Succesfull saved user")
        })
    }
}

function getAllUsers() {
    fs.readFile('userDB.txt', (error, allUsers) => {
        if(error) {
            console.log("error reading from file", error)
        } else {
            console.log(allUsers)
            const parsedUsers = JSON.parse(allUsers)
            console.log(parsedUsers)
            return parsedUsers;
        }
    })

}

module.exports = { saveUser, users }