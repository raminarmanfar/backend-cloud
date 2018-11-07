import { UserRoleEnum } from './enums/UserRoleEnum';

export class MenuItem {
  constructor(
      public title: string,
      public routePath: string,
      public accessibleBy: Array<UserRoleEnum>,
      public tooltip?: string
  ) {}
}