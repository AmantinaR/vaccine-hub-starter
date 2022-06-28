const { UnauthorizedError } = require('../utils/errors');

class User {
    static async login(credentials) {
        //user should submit email and password
        //if any fields missing, throw an error
        //
        //lookup user in db by email
        //if found, compare submitted password with password in db
        //if there is a match, return user
        //
        //if any of this goes wrong, throw an error
        throw new UnauthorizedError("Invalud email/password combo")
    }

    static async register(credentials) {
        //user should sbumit email, pass, first and last name
        //if any fields missing, throw error
        //
        //make sure no user already exists in system w that email
        //if one does, throw an error

        //take users password and hash it
        //take meail and lowercase it

        //create new user in db w info
        //return user
    }
}

module.exports = User