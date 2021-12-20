const { PrismaClient } = require('@prisma/client')
const { resolvers: scalarResolvers } = require('graphql-scalars')
const db = new PrismaClient()

module.exports = {
  Query: {
    singleclass(_root, { id }) {
      return db.tbl_classlist.findUnique({
        where: { id },
      })
    },
    classes() {
      return db.tbl_classlist.findMany()
    },
    classNumber(_root, { classNumber }) {
      return db.tbl_classlist.findUnique({ where: { classNumber } })
    },
    categories() {
      return db.tbl_category.findMany()
    },
    category(_root, { id }) {
      return db.tbl_category.findUnique({
        where: { id },
      })
    },
    disciplines() {
      return db.tbl_discipline.findMany()
    },
    discipline(_root, { id }) {
      return db.tbl_discipline.findUnique({
        where: { id },
      })
    },
    levels() {
      return db.tbl_level.findMany()
    },
    level(_root, { id }) {
      return db.tbl_level.findUnique({
        where: { id },
      })
    },
    sacredTitles() {
      return db.tbl_sacred.findMany()
    },
    sacredTitle(_root, { id }) {
      return db.tbl_sacred.findUnique({
        where: { id },
      })
    },
    subdisciplines() {
      return db.tbl_subdiscipline.findMany()
    },
    subdiscipline(_root, { id }) {
      return db.tbl_subdiscipline.findUnique({
        where: { id },
      })
    },
    trophies() {
      return db.tbl_trophy.findMany()
    },
    trophy(root, { id }) {
      return db.tbl_trophy.findUnique({
        where: { id },
      })
    },
  },

  Category: {
    async classes(root) {
      return await db.tbl_classlist.findMany({
        where: { id: root.category },
      })
    },
  },
  ClassTrophy: {},
  Discipline: {},
  Sacred: {},
  Level: {},
  Subdiscipline: {},
  Trophy: {},

  Classlist: {
    async discipline(root) {
      return await db.tbl_discipline.findUnique({
        where: { id: root.discipline },
      })
    },
    async subdiscipline(root) {
      return await db.tbl_subdiscipline.findUnique({
        where: { id: root.subdiscipline },
      })
    },
    async category(root) {
      return await db.tbl_category.findUnique({
        where: { id: root.category },
      })
    },
    async level(root) {
      return await db.tbl_level.findUnique({
        where: { id: root.level },
      })
    },
  },
}
