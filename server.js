const express = require ('express');
const app = express();

app.use(express.json());

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname,'./public/pages/home.html'));
});

const PORT = 3000;
app.listen(PORT,() => {
    console.log(`Server is listening on port: ${PORT}`);
});