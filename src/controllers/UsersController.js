const { hash } = require("bcryptjs")
const sqliteConection = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const database = await sqliteConection();
        const checkUsersExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
        

        if(checkUsersExists) {
            throw new AppError("Este e-mail já está em uso! Utilize outro.")
        }

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        response.status(201).json({ name, email, password });   
    }

    async update(request, response) {
        const { name, email } = request.body;
        const { id } = request.params;

        const database = await sqliteConection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        if(!user) {
            throw new AppError("Usuário não encontrado!");
        }

        const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
            throw new AppError("Este e-mail já está em uso.");
        }

        user.name = name;
        user.email = email;

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            updated_at = ?
            WHERE id = ?
        `,[user.name, user.email, new Date(), id]);

        return response.json();
    }
}

module.exports = UsersController