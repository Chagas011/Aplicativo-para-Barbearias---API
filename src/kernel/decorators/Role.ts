import { Role } from "@/shared/types/Role";

const ROLES_METADATA_KEY = "custom:role";

export function Roles(...role: Role[]): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(ROLES_METADATA_KEY, role, target);
  };
}

export function getRoles(target: any): Role[] | undefined {
  return Reflect.getMetadata(ROLES_METADATA_KEY, target.constructor);
}
