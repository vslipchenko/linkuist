import {Icon} from '@@types/assets/assets.interfaces';

const ASSETS_FOLDER = 'assets/';

const ICONS_FOLDER = `${ASSETS_FOLDER}icons/`;
export const CUSTOM_ICONS_FOLDER = `${ICONS_FOLDER}custom/`;
export const MATERIAL_ICONS_FOLDER = `${ICONS_FOLDER}material/`;
export const ICONS: Array<Icon> = [
  {name: 'login', fileName: 'login-24px', isMaterial: true, isOutlined: true},
  {name: 'person-add', fileName: 'person_add-24px', isMaterial: true, isFilled: true},
  {name: 'explore', fileName: 'explore-24px', isMaterial: true, isOutlined: true},
  {name: 'architecture', fileName: 'architecture-24px', isMaterial: true, isOutlined: true},
  {name: 'share', fileName: 'share-24px', isMaterial: true, isOutlined: true},
  {name: 'support', fileName: 'support-24px', isMaterial: true, isOutlined: true},
  {name: 'visibility', fileName: 'visibility-24px', isMaterial: true, isFilled: true},
  {name: 'visibility-off', fileName: 'visibility_off-24px', isMaterial: true, isFilled: true},
  {
    name: 'account-settings',
    fileName: 'account_settings-24px',
    isMaterial: true,
    isFilled: true,
  },
  {name: 'add', fileName: 'add-24px', isMaterial: true, isOutlined: true},
  {name: 'linkuist', fileName: 'linkuist_bold-24px', isCustom: true, isOutlined: true},
  {name: 'home', fileName: 'home-24px', isMaterial: true, isFilled: true},
  {name: 'exit-to-app', fileName: 'exit_to_app-24px', isMaterial: true, isOutlined: true},
  {name: 'pencil-plus', fileName: 'pencil_plus-24px', isMaterial: true, isFilled: true},
  {
    name: 'bookmark-collection',
    fileName: 'collections_bookmark-24px',
    isMaterial: true,
    isFilled: true,
  },
  {name: 'bookmark-plus', fileName: 'book_plus-24px', isMaterial: true, isFilled: true},
  {name: 'cancel', fileName: 'cancel-24px', isMaterial: true, isFilled: true},
  // {name: 'google', fileName: 'google-24px', isOutlined: true},
  // {name: 'facebook', fileName: 'facebook-24px', isOutlined: true}
];
