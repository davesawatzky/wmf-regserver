import { Context } from '../../../server'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import JWT_SIGNATURE from '../../../utils/keys'
import { tbl_user } from '@prisma/client'

interface SignupArgs {
	credentials: {
		firstName: string
		lastName: string
		email: tbl_user['email']
		password: tbl_user['password']
	}
}

interface SigninArgs {
	credentials: {
		email: tbl_user['email']
		password: tbl_user['password']
	}
}

interface UserPayload {
	userErrors: {
		message: string
	}[]
	token: string | null
}

export const AuthMutations = {
	signup: async (
		_: any,
		{ credentials }: SignupArgs,
		{ db }: Context
	): Promise<UserPayload> => {
		const { firstName, lastName, email, password } = credentials
		if (!email || !password || !firstName || !lastName) {
			return {
				userErrors: [
					{
						message:
							'You must provide first and last name, username and password',
					},
				],
				token: null,
			}
		}
		const isFirstName = validator.isAlpha(firstName, 'en-US' || 'fr-CA', {
			ignore: ' -',
		})
		if (!isFirstName) {
			return {
				userErrors: [{ message: 'Invalid text in first name' }],
				token: null,
			}
		}
		const isLastName = validator.isAlpha(lastName, 'en-US' || 'fr-CA', {
			ignore: ' -',
		})

		if (!isLastName) {
			return {
				userErrors: [{ message: 'Invalid text in last name' }],
				token: null,
			}
		}
		const isEmail = validator.isEmail(email)
		if (!isEmail) {
			return {
				userErrors: [{ message: 'Invalid email' }],
				token: null,
			}
		}
		const emailExists = await db.tbl_user.findUnique({
			where: {
				email: email.toLowerCase(),
			},
		})
		if (emailExists) {
			return {
				userErrors: [{ message: 'Account already exists' }],
				token: null,
			}
		}

		const isValidPassword = validator.isStrongPassword(password, {
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			returnScore: false,
		})
		if (!isValidPassword) {
			return {
				userErrors: [{ message: 'Invalid password' }],
				token: null,
			}
		}
		const hashedPassword = await bcrypt.hash(password, 15)
		console.log(firstName, lastName, email.toLowerCase(), hashedPassword)

		const user = await db.tbl_user.create({
			data: {
				firstName,
				lastName,
				email: email.toLowerCase(),
				password: hashedPassword,
				staff: false,
				admin: false,
			},
		})

		const token = await JWT.sign(
			{
				userID: user.id,
				staff: false,
				admin: false,
			},
			JWT_SIGNATURE,
			{ algorithm: 'HS256', expiresIn: 173000 }
		)
		return {
			userErrors: [],
			token,
		}
	},

	signin: async (
		_: any,
		{ credentials }: SigninArgs,
		{ db }: Context
	): Promise<UserPayload> => {
		const { email, password } = credentials

		const user = await db.tbl_user.findUnique({
			where: {
				email: email.toLowerCase(),
			},
		})

		if (!user) {
			return {
				userErrors: [{ message: 'Invalid credentials' }],
				token: null,
			}
		}

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return {
				userErrors: [{ message: 'Invalid credentials' }],
				token: null,
			}
		}

		return {
			userErrors: [],
			token: JWT.sign(
				{ userID: user.id, staff: user.staff, admin: user.admin },
				JWT_SIGNATURE,
				{ algorithm: 'HS256', expiresIn: 173000 }
			),
		}
	},
}
