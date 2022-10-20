import { Context } from '../../../server'
import validator from 'validator'
import { Prisma, tbl_registration, tbl_reg_selection } from '@prisma/client'

interface SelectionPayloadType {
	userErrors: {
		message: string
	}[]
	selection:
		| tbl_reg_selection
		| Prisma.Prisma__tbl_reg_selectionClient<tbl_reg_selection>
		| null
}

export const SelectionMutations = {
	selectionCreate: async (
		_: any,
		{
			registeredClassID,
			selection,
		}: {
			registeredClassID: string
			selection: tbl_reg_selection
		},
		{ db, userInfo }: Context
	): Promise<SelectionPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to add a selection',
					},
				],
				selection: null,
			}
		}

		if (!userInfo.admin && !userInfo.staff) {
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
									id: parseInt(registeredClassID),
								},
							},
						},
					},
				},
			})

			if (idCheck[0].id != userInfo.userID) {
				return {
					userErrors: [
						{
							message: 'Not Authorized to create selection',
						},
					],
					selection: null,
				}
			}
		}

		selection.classpickID = parseInt(registeredClassID)

		return {
			userErrors: [],
			selection: await db.tbl_reg_selection.create({
				data: {
					...selection,
				},
			}),
		}
	},

	selectionUpdate: async (
		_: any,
		{
			selectionID,
			selection,
		}: { selectionID: number; selection: tbl_reg_selection },
		{ db, userInfo }: Context
	): Promise<SelectionPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to update a selection',
					},
				],
				selection: null,
			}
		}

		if (!userInfo.admin && !userInfo.staff) {
			let selectionExists: tbl_reg_selection | null =
				await db.tbl_reg_selection.findUnique({
					where: {
						id: selectionID,
					},
				})
			if (!selectionExists) {
				return {
					userErrors: [
						{
							message: 'Selection does not exist in registration form.',
						},
					],
					selection: null,
				}
			} else {
				let idCheck = await db.tbl_reg_selection.findMany({
					where: {
						id: selectionID,
					},
					select: {
						id: true,
						tbl_reg_classes: {
							select: {
								tbl_registration: {
									select: {
										tbl_user: {
											select: { id: true },
										},
									},
								},
							},
						},
					},
				})

				if (
					!idCheck ||
					idCheck[0].tbl_reg_classes.tbl_registration.tbl_user?.id !=
						userInfo.userID
				) {
					return {
						userErrors: [
							{
								message: 'Not Authorized to update selection',
							},
						],
						selection: null,
					}
				}
			}
		}

		return {
			userErrors: [],
			selection: await db.tbl_reg_selection.update({
				data: {
					...selection,
				},
				where: {
					id: selectionID,
				},
			}),
		}
	},

	selectionDelete: async (
		_: any,
		{ selectionID }: { selectionID: tbl_reg_selection['id'] },
		{ db, userInfo }: Context
	): Promise<SelectionPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [
					{
						message: 'You must be logged in to delete a selection',
					},
				],
				selection: null,
			}
		}

		if (!userInfo.admin && !userInfo.staff) {
			let selectionExists: tbl_reg_selection | null =
				await db.tbl_reg_selection.findUnique({
					where: {
						id: selectionID,
					},
				})
			if (!selectionExists) {
				return {
					userErrors: [
						{
							message: 'Selection does not exist in registration form.',
						},
					],
					selection: null,
				}
			} else {
				let idCheck = await db.tbl_reg_selection.findMany({
					where: {
						id: selectionID,
					},
					select: {
						id: true,
						tbl_reg_classes: {
							select: {
								tbl_registration: {
									select: {
										tbl_user: {
											select: { id: true },
										},
									},
								},
							},
						},
					},
				})

				if (
					!idCheck ||
					idCheck[0].tbl_reg_classes.tbl_registration.tbl_user?.id !=
						userInfo.userID
				) {
					return {
						userErrors: [
							{
								message: 'Not Authorized to delete selection',
							},
						],
						selection: null,
					}
				}
			}
		}
		return {
			userErrors: [],
			selection: await db.tbl_reg_selection.delete({
				where: {
					id: selectionID,
				},
			}),
		}
	},
}
