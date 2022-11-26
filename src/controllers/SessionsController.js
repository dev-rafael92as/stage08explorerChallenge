class SessionsController {
    async create(request, response) {
        const { email, password } = await request.body;

        return response.json({ email, password})
    }
}

module.exports = SessionsController;