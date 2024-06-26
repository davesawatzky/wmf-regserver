import { AuthMutations } from './auth'
import { RegistrationMutations } from './regmutations'
import { PerformerMutations } from './performerMutations'
import { SchoolMutations } from './schoolMutations'
import { TeacherMutations } from './teacherMutations'
import { GroupMutations } from './groupMutations'
import { CommunityMutations } from './communityMutations'
import { RegisteredClassMutations } from './classMutations'
import { SelectionMutations } from './selectionMutations'

export const Mutation = {
	...AuthMutations,
	...RegistrationMutations,
	...PerformerMutations,
	...SchoolMutations,
	...TeacherMutations,
	...GroupMutations,
	...CommunityMutations,
	...RegisteredClassMutations,
	...SelectionMutations,
}
