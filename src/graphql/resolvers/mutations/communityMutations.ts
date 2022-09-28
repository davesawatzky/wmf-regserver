import { Context } from '../../../server'
import validator from 'validator'
import { Prisma, tbl_reg_community } from '@prisma/client'

interface CommunityPayloadType {
	userErrors: {
		message: string
	}[]
	community:
		| tbl_reg_community
		| Prisma.Prisma__tbl_reg_communityClient<tbl_reg_community>
		| null
}

export const CommunityMutations = {
	/**
	 * Create Community Group
	 *
	 * @param registrationID The id of the registration form.
	 * @param community The community details to add to the registration.
	 *
	 **/
	communityCreate: async (
		_: any,
		{
			registrationID,
			community,
		}: { registrationID: number; community: tbl_reg_community },
		{ db, userInfo }: Context
	): Promise<CommunityPayloadType> => {
		/**
		 * Check if user is logged in
		 */
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to add a community group',
					},
				],
				community: null,
			}
		}
		/**
		 * Verify appropraite userID in database.
		 * If UserInfo Exists, check if the actual user is
		 * authorized to add a community to this registration.
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

			if (idCheck?.tbl_user) {
				if (idCheck.tbl_user.id != userInfo.userID) {
					return {
						userErrors: [
							{
								message: 'Not Authorized to create entry',
							},
						],
						community: null,
					}
				}
				if (idCheck.performerType != 'COMMUNITY') {
					return {
						userErrors: [
							{
								message: `Cannot add community group to ${idCheck.performerType} registration form.`,
							},
						],
						community: null,
					}
				}
			}
			/**
			 * Check to see if there is already one community listed if
			 * performerType is set to 'SCHOOL'
			 */
			let communityExists = await db.tbl_reg_community.findUnique({
				where: {
					regID: Number(registrationID),
				},
			})

			if (communityExists) {
				return {
					userErrors: [
						{
							message:
								'Community Registration form already has a community group listed.  Cannot add another community group.',
						},
					],
					community: null,
				}
			}
		}
		/**
		 * Adds the Performer and any details into registration record
		 * in the database.
		 */
		community.regID = Number(registrationID)
		return {
			userErrors: [],
			community: await db.tbl_reg_community.create({
				data: {
					...community,
				},
			}),
		}
	},

	/**
	 * Update Community Details
	 * @param communityID The id number of the community
	 * @param community The community object containing all the details
	 * @returns
	 */
	communityUpdate: async (
		_: any,
		{
			communityID,
			community,
		}: { communityID: number; community: tbl_reg_community },
		{ db, userInfo }: Context
	): Promise<CommunityPayloadType> => {
		/**
		 * Check to make sure user exists
		 */
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to update a community group.',
					},
				],
				community: null,
			}
		}

		/**
		 * First check if the performer exists in the database.
		 * If not, return an error.
		 */
		if (!userInfo.admin && !userInfo.staff) {
			let communityExists: tbl_reg_community | null =
				await db.tbl_reg_community.findUnique({
					where: {
						id: Number(communityID),
					},
				})
			if (!communityExists) {
				return {
					userErrors: [
						{
							message: 'Community group does not exist in registration form.',
						},
					],
					community: null,
				}
			} else {
				/**
				 * Verify appropraite userID in database.
				 * If UserInfo Exists, check if the actual user is
				 * authorized to update performer details in this registration.
				 * Admin and Staff are always allowed.
				 */
				let idCheck = await db.tbl_reg_community.findUnique({
					where: {
						id: Number(communityID),
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

				if (idCheck?.tbl_registration.tbl_user) {
					if (idCheck?.tbl_registration?.tbl_user.id != userInfo.userID) {
						return {
							userErrors: [
								{
									message: 'Not Authorized to update community group.',
								},
							],
							community: null,
						}
					}
				}
			}
		}
		/**
		 * Enters the edits in the database
		 */
		return {
			userErrors: [],
			community: await db.tbl_reg_community.update({
				data: {
					...community,
				},
				where: {
					id: Number(communityID),
				},
			}),
		}
	},

	/**
	 * Deletes a community from a registration form
	 *
	 * @param communityID The id of the community in the database
	 * @returns community object
	 */
	communityDelete: async (
		_: any,
		{ communityID }: { communityID: tbl_reg_community['id'] },
		{ db, userInfo }: Context
	): Promise<CommunityPayloadType> => {
		/**
		 * Check if user is logged in
		 */
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to delete a community group.',
					},
				],
				community: null,
			}
		}
		/**
		 * Verify that the community exists in the database.
		 */
		if (!userInfo.admin && !userInfo.staff) {
			let communityExists: tbl_reg_community | null =
				await db.tbl_reg_community.findUnique({
					where: {
						id: Number(communityID),
					},
				})
			if (!communityExists) {
				return {
					userErrors: [
						{
							message: 'Community group does not exist in registration form.',
						},
					],
					community: null,
				}
			} else {
				/**
				 * Verify appropraite userID in database.
				 * If UserInfo Exists, check if the actual user is
				 * authorized to delete the performer details in this
				 * registration. Admin and Staff are always allowed.
				 */
				let idCheck = await db.tbl_reg_community.findUnique({
					where: {
						id: Number(communityID),
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

				if (idCheck?.tbl_registration.tbl_user) {
					if (idCheck?.tbl_registration?.tbl_user.id != userInfo.userID) {
						return {
							userErrors: [
								{
									message: 'Not Authorized to delete community group.',
								},
							],
							community: null,
						}
					}
				}
			}
		}
		/**
		 * Delete the object from the database
		 */
		return {
			userErrors: [],
			community: await db.tbl_reg_community.delete({
				where: {
					id: Number(communityID),
				},
			}),
		}
	},
}
