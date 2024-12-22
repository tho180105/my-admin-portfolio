import { atom } from 'recoil';


export const aboutState = atom({
  key: 'aboutState',
  default: null,
});


export const bannerState = atom({
  key: 'bannerState',
  default: null,
});

export const headerState = atom({
  key: 'headerState',
  default: null,
});

export const personalProjectsState = atom({
  key: 'personalProjectsState',
  default: null,
});


export const userLoginState = atom({
  key: 'userLoginState',
  default: null,
});

export const allowedUsersLogin = atom({
  key: 'allowedUsersLogin',
  default: ['pham.huy.19951126@gmail.com'],
});

export const currentLanguage = atom({
  key: 'currentLanguage',
  default: 'en-US',
});
