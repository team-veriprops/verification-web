import { getRandomImages } from "@app/api/unsplash/random/lib/unsplash-util";
import {
  LoginSuccessDto,
  QueryUserDto,
  UserStatus,
  UserType,
} from "@components/admin/user/models";
import { QueryProfileDto } from "@components/admin/user/profile/models";
import { QueryRoleDto } from "@components/admin/user/role/models";
import { faker } from "@faker-js/faker";

const system_roles_str = ["User", "Admin", "Accountant", "Legal"];

export async function generateSystemRole(name: string): Promise<QueryRoleDto> {
  return {
    id: faker.string.uuid(),
    name: name,
    description: faker.person.jobDescriptor(),
    system_roles: [name],
    is_system_role: true,
    date_created: faker.date.past().toISOString(),
  };
}

export async function generateAdminRole(
  system_roles: string[]
): Promise<QueryRoleDto> {
  return {
    id: faker.string.uuid(),
    name: faker.person.jobTitle(),
    description: faker.person.jobDescriptor(),
    system_roles: system_roles,
    is_system_role: false,
    date_created: faker.date.past().toISOString(),
  };
}

export async function generateAdminUser(role: string): Promise<QueryUserDto> {
  const first_name = faker.person.firstName();
  const last_name = faker.person.lastName();
  return {
    id: faker.string.uuid(),
    first_name: first_name,
    last_name: last_name,
    fullname: `${first_name} ${last_name}`,
    email: faker.internet.email(),
    role: role,
    status: faker.helpers.arrayElement([
      UserStatus.ACTIVE,
      UserStatus.DEACTIVATED,
      UserStatus.INACTIVE,
      UserStatus.LOCKED,
      UserStatus.PENDING,
    ]),
    type: UserType.ADMIN,
    avatar: (await getRandomImages({ query: "person", count: 1 }).catch(() => []))?.[0]?.url ?? "/placeholder.jpg",
    date_created: faker.date.past().toISOString(),
  };
}
export async function generateUser(): Promise<QueryUserDto> {
  const first_name = faker.person.firstName();
  const last_name = faker.person.lastName();
  return {
    id: faker.string.uuid(),
    first_name: first_name,
    last_name: last_name,
    fullname: `${first_name} ${last_name}`,
    email: faker.internet.email(),
    role: system_roles_str[0],
    status: faker.helpers.arrayElement([
      UserStatus.ACTIVE,
      UserStatus.DEACTIVATED,
      UserStatus.INACTIVE,
      UserStatus.LOCKED,
      UserStatus.PENDING,
    ]),
    type: UserType.USER,
    avatar: (await getRandomImages({ query: "person", count: 1 }).catch(() => []))?.[0]?.url ?? "/placeholder.jpg",
    date_created: faker.date.past().toISOString(),
  };
}

export async function generateUserProfile(
  userId: string
): Promise<QueryProfileDto> {
  return {
    id: faker.string.uuid(),
    user_id: userId,
    verifier_id: faker.string.uuid(),
    referral_code: `VTN-${faker.number.int({ min: 1000, max: 500000 })}`,
  };
}

export const systemRoles: QueryRoleDto[] = [];
export const adminRoles: QueryRoleDto[] = [];
export const adminUsers: QueryUserDto[] = [];
export const users: QueryUserDto[] = [];
export const userProfiles: QueryProfileDto[] = [];

let dataInitialized = false;
// Kick off immediately
const dataInitPromise = initData();

async function initData() {
  // only generate once
  if (systemRoles.length === 0) {
    for (const system_role of system_roles_str) {
      const systemRole = await generateSystemRole(system_role);
      systemRoles.push(systemRole);
    }
  }

  if (adminRoles.length === 0) {
    adminRoles.push(...systemRoles);

    // Create Admin Roles
    const thisAdminRoles = await Promise.all(
      Array.from({ length: 5 }, () =>
        generateAdminRole(faker.helpers.arrayElements(system_roles_str))
      )
    );
    adminRoles.push(...thisAdminRoles);

    // Create Admin Users
    const thisAdminUsers = await Promise.all(
      Array.from({ length: 5 }, () =>
        generateAdminUser(
          faker.helpers.arrayElement(adminRoles.map((role) => role.name))
        )
      )
    );
    adminUsers.push(...thisAdminUsers);

    // Create Users
    const thisUsers = await Promise.all(
      Array.from({ length: 5 }, () => generateUser())
    );
    users.push(...thisUsers);

    // Create User Profiles
    for (const user of users) {
      const thisUserProfile = await generateUserProfile(user.id!);
      userProfiles.push(thisUserProfile);
    }
  }

  dataInitialized = true
}

export async function getActiveAuditor(): Promise<LoginSuccessDto> {
  // Delay
  if (!dataInitialized) {
    await dataInitPromise;
  }

  // Active User
  const user = users[0];
  const profile = userProfiles.find(
    (userProfile) => userProfile.user_id === user.id
  );

  return { ...user, ...profile };
}
