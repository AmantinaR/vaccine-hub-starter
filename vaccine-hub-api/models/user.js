const bcrypt = require('bcrypt');
const db = require('../db');
const {BCRYPT_WORK_FACTOR} = require('../config');
const { UnauthorizedError, BadRequestError } = require('../utils/errors');

class User {
    static async makePublicUser(user) {
        return{
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            location: user.location,
            date: user.date
        }
    }

    static async login(credentials) {
        //user should submit email and password
        //if any fields missing, throw an error
        //
        const requiredFields = ['email', 'password'];
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })
        
        //lookup user in db by email
        const user = await User.fetchUserByEmail(credentials.email);
        
        //if found, compare submitted password with password in db
        //if there is a match, return user
        if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (isValid) {
                return User.makePublicUser(user);
            }

        }
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
        const hashedPw = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR);
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
        `, [lowercasedEmail, hashedPw, credentials.firstName, credentials.lastName, credentials.location, credentials.date])

        //return user
        const user = result.rows[0];

        return User.makePublicUser(user);
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