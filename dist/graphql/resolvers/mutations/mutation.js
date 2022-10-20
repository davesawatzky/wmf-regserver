"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
const auth_1 = require("./auth");
const regmutations_1 = require("./regmutations");
const performerMutations_1 = require("./performerMutations");
const schoolMutations_1 = require("./schoolMutations");
const teacherMutations_1 = require("./teacherMutations");
const groupMutations_1 = require("./groupMutations");
const communityMutations_1 = require("./communityMutations");
const classMutations_1 = require("./classMutations");
const selectionMutations_1 = require("./selectionMutations");
exports.Mutation = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, auth_1.AuthMutations), regmutations_1.RegistrationMutations), performerMutations_1.PerformerMutations), schoolMutations_1.SchoolMutations), teacherMutations_1.TeacherMutations), groupMutations_1.GroupMutations), communityMutations_1.CommunityMutations), classMutations_1.RegisteredClassMutations), selectionMutations_1.SelectionMutations);
//# sourceMappingURL=mutation.js.map