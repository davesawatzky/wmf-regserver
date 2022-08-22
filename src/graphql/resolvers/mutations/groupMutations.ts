import { Context } from '../../../server'
import validator from 'validator'
import { Prisma, tbl_registration, tbl_reg_group } from '@prisma/client'

interface GroupPayloadType {
	userErrors: {
		message: string
	}[]
	group:
		| tbl_reg_group
		| Prisma.Prisma__tbl_reg_groupClient<tbl_reg_group>
		| null
}

export const GroupMutations = {
	/**
	 * Create a performing group registration
	 *
	 * @param registrationID The id of the registration form.
	 * @param group The group object containing all the details.
	 * @returns The group object
	 */
	groupCreate: async (
		_: any,
		{ registrationID, group }: { registrationID: number; group: tbl_reg_group },
		{ db, userInfo }: Context
	): Promise<GroupPayloadType> => {
		/**
		 * Check if user is logged in.
		 */
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to add a group',
					},
				],
				group: null,
			}
		}
		/**
		 * Verify appropraite userID in database.
		 * If UserInfo Exists, check if the actual user is
		 * authorized to add a performing group to this registration.
		 * Admin and Staff are always allowed.
		 */
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
							message: 'Not Authorized to create group',
						},
					],
					group: null,
				}
			}

			/**
			 * Verify that the performingType is set to 'Group'.
			 */
			if (idCheck.performerType != 'GROUP') {
				return {
					userErrors: [
						{
							message: 'Group can only be added to group registration form',
						},
					],
					group: null,
				}
			}
		}
		/**
		 * Enter group details into the database and registration form.
		 */
		group.regID = Number(registrationID)
		console.log(group)

		return {
			userErrors: [],
			group: await db.tbl_reg_group.create({
				data: {
					...group,
				},
			}),
		}
	},
	/**
	 * Update an existing group
	 *
	 * @param groupID The id number of an existing group
	 * @param group The group details object
	 * @returns group
	 */
	groupUpdate: async (
		_: any,
		{ groupID, group }: { groupID: number; group: tbl_reg_group },
		{ db, userInfo }: Context
	): Promise<GroupPayloadType> => {
		/**
		 * Verify that a user is logged in.
		 */
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to update a group',
					},
				],
				group: null,
			}
		}
		/**
		 * Verify that the group exists in the database
		 */
		if (!userInfo.admin && !userInfo.staff) {
			let groupExists: tbl_reg_group | null = await db.tbl_reg_group.findUnique(
				{
					where: {
						id: Number(groupID),
					},
				}
			)
			if (!groupExists) {
				return {
					userErrors: [
						{
							message: 'Group does not exist in registration form.',
						},
					],
					group: null,
				}
			} else {
				/**
				 * Verify appropraite userID in database.
				 * If UserInfo Exists, check if the actual user is
				 * authorized to update performer details in this registration.
				 * Admin and Staff are always allowed.
				 */
				let idCheck = await db.tbl_reg_group.findUnique({
					where: {
						id: Number(groupID),
					},
					select: {
						id: true,
						tbl_registration: {
							select: {
								tbl_user: {
									select: { id: true },
								},
							},
						},
					},
				})

				if (idCheck?.tbl_registration?.tbl_user?.id != userInfo.userID) {
					return {
						userErrors: [
							{
								message: 'Not Authorized to update group',
							},
						],
						group: null,
					}
				}
			}
		}
		/**
		 * Updates the database
		 */
		return {
			userErrors: [],
			group: await db.tbl_reg_group.update({
				data: {
					...group,
				},
				where: {
					id: Number(groupID),
				},
			}),
		}
	},
	/**
	 * Delete group from the database and registration form
	 *
	 * @param groupID The id number of the group in the database
	 * @returns group
	 */
	groupDelete: async (
		_: any,
		{ groupID }: { groupID: tbl_reg_group['id'] },
		{ db, userInfo }: Context
	): Promise<GroupPayloadType> => {
		/**
		 * Check if a user is logged in
		 */
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to delete a group',
					},
				],
				group: null,
			}
		}
		/**
		 * Verify that the group exists in the database
		 */
		if (!userInfo.admin && !userInfo.staff) {
			let groupExists: tbl_reg_group | null = await db.tbl_reg_group.findUnique(
				{
					where: {
						id: Number(groupID),
					},
				}
			)
			if (!groupExists) {
				return {
					userErrors: [
						{
							message: 'Group does not exist in registration form.',
						},
					],
					group: null,
				}
			} else {
				/**
				 * Verify appropraite userID in database.
				 * If UserInfo Exists, check if the actual user is
				 * authorized to delete the performer details in this
				 * registration. Admin and Staff are always allowed.
				 */
				let idCheck = await db.tbl_reg_group.findUnique({
					where: {
						id: Number(groupID),
					},
					select: {
						id: true,
						tbl_registration: {
							select: {
								tbl_user: {
									select: { id: true },
								},
							},
						},
					},
				})

				if (idCheck?.tbl_registration?.tbl_user?.id != userInfo.userID) {
					return {
						userErrors: [
							{
								message: 'Not Authorized to delete group',
							},
						],
						group: null,
					}
				}
			}
		}

		/**
		 * Removes the group from the registration form and database.
		 */
		return {
			userErrors: [],
			group: await db.tbl_reg_group.delete({
				where: {
					id: Number(groupID),
				},
			}),
		}
	},
}
