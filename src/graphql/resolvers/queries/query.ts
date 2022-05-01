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
  User,
}
