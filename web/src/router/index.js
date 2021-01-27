import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import home from '@/views/home'
import Login from '@/components/Login'
import Organization from '@/views/system/Organization'
import FactoryManagement from '@/views/system/FactoryManagement'
import Role from '@/views/system/Role'
import TeamGroup from '@/views/system/TeamGroup'
import Personnel from '@/views/system/Personnel'
import Permission from '@/views/system/Permission'
import Log from '@/views/system/Log'
import flowGraph from '@/views/system/flowGraph'
import BuildTable from '@/views/system/BuildTable'

// 设备管理
import list from '@/views/Equipment/list'
import equipmentTree from '@/views/Equipment/equipmentTree'
import EqDetails from '@/views/Equipment/EqDetails'
import Inventory from '@/views/Equipment/Inventory'


Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      meta:{ title:'系统管理' },
      component: Index,
      redirect:'/home', //index主页默认加载home页面
      children:[
        {path:'/home',name:'home',meta:{ title:'首页'},component:home},
        {path:'/Organization',name:'Organization',meta:{ title:'组织架构',type:"系统管理"},component:Organization},
        {path:'/FactoryManagement',name:'FactoryManagement',meta:{ title:'区域管理',type:"系统管理"},component:FactoryManagement},
        {path:'/Role',name:'Role',meta:{ title:'角色权限',type:"系统管理"},component:Role},
        {path:'/TeamGroup',name:'TeamGroup',meta:{ title:'班组管理',type:"系统管理"},component:TeamGroup},
        {path:'/Personnel',name:'Personnel',meta:{ title:'人员管理',type:"系统管理"},component:Personnel},
        {path:'/Permission',name:'Permission',meta:{ title:'权限维护',type:"系统管理"},component:Permission},
        {path:'/Log',name:'Log',meta:{ title:'系统日志',type:"系统管理"},component:Log},
        {path:'/flowGraph',name:'flowGraph',meta:{ title:'流程图管理',type:"系统管理"},component:flowGraph},
        {path:'/BuildTable',name:'BuildTable',meta:{ title:'可视化建表',type:"系统管理"},component:BuildTable},
      ]
    },
    {
      path: '/',
      name: 'Index',
      meta:{ title:'设备管理' },
      component: Index,
      redirect:'/home', //index主页默认加载home页面
      children:[
        {path:'/list',name:'list',meta:{ title:'设备台账',type:"设备管理"},component:list,children:[
            {path:'/EqDetails',name:'EqDetails',meta:{ title:'设备详情'},component:EqDetails},
          ]},
        {path:'/equipmentTree',name:'equipmentTree',meta:{ title:'设备结构树',type:"设备管理"},component:equipmentTree},
        {path:'/Inventory',name:'Inventory',meta:{ title:'设备盘点',type:"设备管理"},component:Inventory},
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ]
})
