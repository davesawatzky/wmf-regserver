import {
	festivalQueries,
	Category,
	Classlist,
	Discipline,
	Sacred,
	Level,
	Subdiscipline,
	Trophy,
} from './festivalQuery'
import {
	registrationQueries,
	Registration,
	RegisteredClass,
	School,
	User,
} from './regqueries'

export const Query = {
	...festivalQueries,
	...registrationQueries,
}

export const OtherQueries = {
	Category,
	Classlist,
	Discipline,
	Sacred,
	Level,
	Subdiscipline,
	Trophy,
	Registration,
	RegisteredClass,
	School,
	User,
}
