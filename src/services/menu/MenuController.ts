import { Promise } from 'mongoose';
import { MenuItem } from '../../models/MenuItem';
import { ServiceResponse } from '../../models/ServiceResponse';
import { UserRoleEnum } from '../../models/enums/UserRoleEnum';

export default class MenuController {
    public getAll(): Promise<ServiceResponse> {
        return new Promise((resolve: any) => {
            const menuList: Array<MenuItem> = new Array<MenuItem>();
            menuList.push(new MenuItem('Home', '/', new Array<UserRoleEnum>(UserRoleEnum.Public, UserRoleEnum.User, UserRoleEnum.Admin), 'Home page'));
            menuList.push(new MenuItem('Dashboard', '/dashboard/user-page', new Array<UserRoleEnum>(UserRoleEnum.User), 'Your personal dashboard'));
            menuList.push(new MenuItem('Dashboard', '/dashboard/admin-page', new Array<UserRoleEnum>(UserRoleEnum.Admin), 'Administrator dashboard'));
            menuList.push(new MenuItem('Manage Users', '/dashboard/manage-users', new Array<UserRoleEnum>(UserRoleEnum.Admin), 'My projects'));
            menuList.push(new MenuItem('Projects', '/public/projects', new Array<UserRoleEnum>(UserRoleEnum.Public, UserRoleEnum.User, UserRoleEnum.Admin), 'My projects'));
            menuList.push(new MenuItem('Goals', '/public/goals', new Array<UserRoleEnum>(UserRoleEnum.Public, UserRoleEnum.User, UserRoleEnum.Admin), 'My Goals'));
            menuList.push(new MenuItem('About Me', '/public/about-me', new Array<UserRoleEnum>(UserRoleEnum.Public, UserRoleEnum.User, UserRoleEnum.Admin), 'Breifly about my life'));
            menuList.push(new MenuItem('Contact Me', '/public/contact-me', new Array<UserRoleEnum>(UserRoleEnum.Public, UserRoleEnum.User, UserRoleEnum.Admin), 'Ways to contact me'));
            resolve(new ServiceResponse(true, 200, 'Navbar menu items fetched.', menuList));
        });
    }
}