const express = require ('express');
var fs = require('fs');
const app = express();

app.use(express.json());

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname,'./public/pages/home.html'));
});

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