import { adminSchema } from '../schemas/adminSchema';
import { usersToGroupSchema } from '../schemas/intermediates/usersToGroupSchema';
import { problemSchema } from '../schemas/problemSchema';
import { profileSchema } from '../schemas/profileSchema';
import { sessionSchema } from '../schemas/sessionSchema';
import { submissionSchema } from '../schemas/submissionSchema';
import { testSchema } from '../schemas/testSchema';
import { groupSchema } from '../schemas/groupSchema';
import { userSchema } from '../schemas/userSchema';

export default {
    profileSchema,
    sessionSchema,
    userSchema,
    problemSchema,
    submissionSchema,
    testSchema,
    adminSchema,
    userGroupSchema: groupSchema,
    usersToUserGroupSchema: usersToGroupSchema,
};
