const express = require("express");

const app = express();
app.use(express.json())

app.post("/users", (request, response) => {
    const { name, email, password } = request.body;

    response.send(`
    Meu nome é ${name} meu email é ${email} e sua senha é ${password}`)
})

const PORT = 3333;
app.listen(PORT, () => console.log('Server is running on Port ' + PORT))