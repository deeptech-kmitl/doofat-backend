import getMenus from './getMenus.controller'
import getMenu from './getMenu.controller'
import create from './create.controller'
import edit from './edit.controller'
import deleteMN from './delete.controller'
export default {
    getMenus,
    create,
    edit,
    getMenu,
    delete: deleteMN
}