import { adminSchema } from '../schemas/adminSchema';
import { usersToUserGroupSchema } from '../schemas/intermediates/usersToUserGroupSchema';
import { problemSchema } from '../schemas/problemSchema';
import { profileSchema } from '../schemas/profileSchema';
import { sessionSchema } from '../schemas/sessionSchema';
import { submissionSchema } from '../schemas/submissionSchema';
import { testSchema } from '../schemas/testSchema';
import { userGroupSchema } from '../schemas/userGroupSchema';
import { userSchema } from '../schemas/userSchema';

export default {
    profileSchema,
    sessionSchema,
    userSchema,
    problemSchema,
    submissionSchema,
    testSchema,
    adminSchema,
    userGroupSchema,
    usersToUserGroupSchema,
};
