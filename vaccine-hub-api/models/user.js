const db = require('../db');
const { UnauthorizedError, BadRequestError } = require('../utils/errors');

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
        const requiredFields = ['email', 'password', 'firstName', 'lastName', 'location', 'date'];
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })
        if (credentials.email.indexOf('@') <= 0) {
            throw new BadRequestError("Invalid Email")
        }
        //
        //make sure no user already exists in system w that email
        //if one does, throw an error
        const existingUser = await User.fetchUserByEmail(credentials.email);
        if (existingUser) {
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }

        //take users password and hash it
        //LEAVE THIS OUT TO SEE WHAT HAPPENS
        //take meail and lowercase it
        const lowercasedEmail = credentials.email.toLowerCase();

        //create new user in db w info
        const result = await db.query(`
            INSERT INTO users (
                email,
                password,
                first_name,
                last_name,
                location,
                date
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, first_name, last_name, location, date;
        `, [lowercasedEmail, credentials.password, credentials.firstName, credentials.lastName, credentials.location, credentials.date])

        //return user
        const user = result.rows[0];

        return user;
    }

    static async fetchUserByEmail(email) {
        if(!email) {
            throw new BadRequestError("no email provided");
        }

        const query = `SELECT * FROM users WHERE email = $1`;

        const result = await db.query(query, [email.toLowerCase()]);

        const user = result.rows[0];

        return user;
    }
}

module.exports = User