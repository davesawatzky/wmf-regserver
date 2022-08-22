import JWT from 'jsonwebtoken'
import JWT_SIGNATURE from '../utils/keys'

export const getUserFromToken = (token: string) => {
	try {
		return JWT.verify(token, JWT_SIGNATURE) as {
			userID: number
			staff: boolean
			admin: boolean
		}
	} catch (error) {
		return null
	}
}
