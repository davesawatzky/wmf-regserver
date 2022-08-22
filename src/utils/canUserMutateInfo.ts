import { Context } from '../server'

interface CanUserMutateInfo {
	userID: number
	registrationID: number
	db: Context['db']
}

export const canUserMutateInfo = async ({
	userID,
	registrationID,
	db,
}: CanUserMutateInfo) => {
	const user = await db.tbl_user.findUnique({
		where: {
			id: userID,
		},
	})

	if (!user) {
		return {
			userErrors: [{ message: 'User not found' }],
			registration: null,
		}
	}

	const registration = await db.tbl_registration.findUnique({
		where: {
			id: registrationID,
		},
	})

	if (registration?.userID !== user.id) {
		return {
			userErrors: [{ message: 'Not authorized' }],
			registration: null,
		}
	}
}
