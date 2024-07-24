import { adminSchema } from '../schemas/adminSchema';
import { usersToGroupSchema } from '../schemas/intermediates/usersToGroupSchema';
import { problemSchema } from '../schemas/problemSchema';
import { profileSchema } from '../schemas/profileSchema';
import { sessionSchema } from '../schemas/sessionSchema';
import { submissionSchema } from '../schemas/submissionSchema';
import { testSchema } from '../schemas/testSchema';
import { groupSchema } from '../schemas/groupSchema';
import { userSchema } from '../schemas/userSchema';
import { bundleSchema } from '../schemas/bundleSchema';
import { passwordResetTokenSchema } from '../schemas/passwordResetTokenSchema';
import { problemsToBundleSchema } from '../schemas/intermediates/problemsToBundleSchema';
import { contestSchema } from '../schemas/contestSchema';
import { usersToContestSchema } from '../schemas/intermediates/usersToContestSchema';
import { problemsToContestSchema } from '../schemas/intermediates/problemsToContestSchema';

export default {
    profileSchema,
    sessionSchema,
    userSchema,
    problemSchema,
    submissionSchema,
    testSchema,
    adminSchema,
    groupSchema,
    usersToGroupSchema,
    bundleSchema,
    contestSchema,
    problemsToBundleSchema,
    passwordResetTokenSchema,
    usersToContestSchema,
    problemsToContestSchema,
};
