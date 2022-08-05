import { Context } from '../../../index'
import validator from 'validator'
import { Prisma, tbl_registration, tbl_reg_classes } from '@prisma/client'

interface RegisteredClassPayloadType {
	userErrors: {
		message: string
	}[]
	registeredClass:
		| tbl_reg_classes
		| Prisma.Prisma__tbl_reg_classesClient<tbl_reg_classes>
		| null
}

export const RegisteredClassMutations = {
	/**
	 *
	 * Add Classes to a registration Form
	 * @param registrationID The id of the registration form.
	 * @param registeredClass The class object to add to the registration form.
	 */
	registeredClassCreate: async (
		_: any,
		{
			registrationID,
			registeredClass,
		}: { registrationID: string; registeredClass: tbl_reg_classes },
		{ db, userInfo }: Context
	): Promise<RegisteredClassPayloadType> => {
		/**
		 * Check if User is logged in.
		 */
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to add a class',
					},
				],
				registeredClass: null,
			}
		}

		if (!userInfo.admin && !userInfo.staff) {
			let idCheck = await db.tbl_registration.findUnique({
				where: {
					id: Number(registrationID),
				},
				select: {
					id: true,
					performerType: true,
					tbl_user: {
						select: { id: true },
					},
				},
			})

			if (idCheck?.tbl_user?.id != userInfo.userID) {
				return {
					userErrors: [
						{
							message: 'Not Authorized to enter a class',
						},
					],
					registeredClass: null,
				}
			}
		}
		/**
		 * Check to see if the class is already listed in registration.
		 */
		let classExists = await db.tbl_reg_classes.findMany({
			where: {
				regID: registeredClass.regID,
				classNumber: registeredClass.classNumber,
			},
		})

		if (classExists.length > 0) {
			return {
				userErrors: [
					{
						message: `Registration form already includes class ${registeredClass.classNumber}.  Cannot add duplicate class.`,
					},
				],
				registeredClass: null,
			}
		}

		registeredClass.regID = +registrationID
		return {
			userErrors: [],
			registeredClass: await db.tbl_reg_classes.create({
				data: {
					...registeredClass,
				},
			}),
		}
	},

	registeredClassUpdate: async (
		_: any,
		{
			registeredClassID,
			registeredClass,
		}: { registeredClassID: number; registeredClass: tbl_reg_classes },
		{ db, userInfo }: Context
	): Promise<RegisteredClassPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to update a class',
					},
				],
				registeredClass: null,
			}
		}

		if (!userInfo.admin && !userInfo.staff) {
			let classEntryExists: tbl_reg_classes | null =
				await db.tbl_reg_classes.findUnique({
					where: {
						id: Number(registeredClassID),
					},
				})
			if (!classEntryExists) {
				return {
					userErrors: [
						{
							message: 'Class entry does not exist in registration form.',
						},
					],
					registeredClass: null,
				}
			} else {
				let idCheck = await db.tbl_user.findMany({
					select: {
						id: true,
						tbl_registration: {
							select: {
								id: true,
								tbl_reg_classes: {
									select: {
										id: true,
									},
									where: {
										id: registeredClassID,
									},
								},
							},
						},
					},
				})
				console.log(registeredClassID)

				if (
					!idCheck ||
					idCheck.length > 1 ||
					idCheck[0].id != userInfo.userID
				) {
					return {
						userErrors: [
							{
								message: 'Not Authorized to update class entry',
							},
						],
						registeredClass: null,
					}
				}
			}
		}

		return {
			userErrors: [],
			registeredClass: await db.tbl_reg_classes.update({
				data: {
					...registeredClass,
				},
				where: {
					id: Number(registeredClassID),
				},
			}),
		}
	},

	registeredClassDelete: async (
		_: any,
		{ id }: tbl_reg_classes,
		{ db, userInfo }: Context
	): Promise<RegisteredClassPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to delete a class entry',
					},
				],
				registeredClass: null,
			}
		}

		if (!userInfo.admin && !userInfo.staff) {
			let classEntryExists: tbl_reg_classes | null =
				await db.tbl_reg_classes.findUnique({
					where: {
						id: Number(id),
					},
				})
			if (!classEntryExists) {
				return {
					userErrors: [
						{
							message: 'Class entry does not exist in registration form.',
						},
					],
					registeredClass: null,
				}
			} else {
				let idCheck = await db.tbl_user.findMany({
					select: {
						id: true,
						tbl_registration: {
							select: {
								id: true,
								tbl_reg_classes: {
									select: {
										id: true,
									},
									where: {
										id,
									},
								},
							},
						},
					},
				})

				if (
					!idCheck ||
					idCheck.length > 1 ||
					idCheck[0].id != userInfo.userID
				) {
					return {
						userErrors: [
							{
								message: 'Not Authorized to delete class entry',
							},
						],
						registeredClass: null,
					}
				}
			}
		}
		return {
			userErrors: [],
			registeredClass: await db.tbl_reg_classes.delete({
				where: {
					id: Number(id),
				},
			}),
		}
	},
}
