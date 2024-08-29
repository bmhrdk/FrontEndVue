import api from '../api.js';
import { createRouter, createWebHistory } from 'vue-router'
import Register from '@/views/Register.vue'
import Sidebar from '../views/admin/Sidebar.vue'
import StatisticHome from '../views/admin/StatisticHome.vue'
import Service from '../views/admin/service/Service.vue'
import ServiceList from '../views/admin/service/ServiceList.vue'
import Inventory from '../views/admin/inventory/Inventory.vue'
import InventoryList from '../views/admin/inventory/InventoryList.vue'
import NewInventory from '@/views/admin/inventory/NewInventory.vue'
import EditInventory from '@/views/admin/inventory/EditInventory.vue'
import NewService from '../views/admin/service/NewService.vue'
import EditService from '../views/admin/service/EditService.vue'
import DataCustomer from '../views/admin/dataCustomer/DataCustomer.vue'
import DataCustomerList from '../views/admin/dataCustomer/DataCustomerList.vue'
import NewCustomer from '@/views/admin/dataCustomer/NewCustomer.vue'
import EditCustomer from '@/views/admin/dataCustomer/EditCustomer.vue'
import SidebarCust from '@/views/customer/SidebarCust.vue'
import HistoryCust from '@/views/customer/history/HistoryCust.vue'
import HistoryCustList from '@/views/customer/history/HistoryCustList.vue'
import StatusCust from '@/views/customer/status/StatusCust.vue'
import StatusCustList from '@/views/customer/status/StatusCustList.vue'
import BookingCust from '@/views/customer/booking/BookingCust.vue'
import BookingQueCust from '@/views/customer/booking/BookingQueCust.vue'
import Antrian from '@/views/admin/antrian/Antrian.vue'
import AntrianList from '@/views/admin/antrian/AntrianList.vue'
import Login from '../views/Login.vue'
import SidebarTec from '@/views/technician/SidebarTec.vue'
import ServiceTec from '@/views/technician/ServiceTec.vue'
import ServiceTecList from '@/views/technician/ServiceTecList.vue'
import NewServiceTec from '@/views/technician/NewServiceTec.vue';
import EditServiceTec from '@/views/technician/EditServiceTec.vue'
import DataTechnician from '@/views/admin/dataTechnician/DataTechnician.vue'
import DataTechnicianList from '@/views/admin/dataTechnician/DataTechnicianList.vue';
import NewTechnician from '@/views/admin/dataTechnician/NewTechnician.vue';
import EditTechnician from '@/views/admin/dataTechnician/EditTechnician.vue';
import DataAdmin from '@/views/admin/dataAdmin/DataAdmin.vue';
import DataAdminList from '@/views/admin/dataAdmin/DataAdminList.vue';
import NewAdmin from '@/views/admin/dataAdmin/NewAdmin.vue';
import EditAdmin from '@/views/admin/dataAdmin/EditAdmin.vue';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/admin',
      name: 'sidebar',
      component: Sidebar,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: 'beranda',
          name: 'beranda',
          component: StatisticHome,
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: 'service',
          name: 'service',
          component: Service,
          meta: { requiresAuth: true, requiresAdmin: true },
          children: [
            {
              path: '',
              name: 'serviceList',
              component: ServiceList,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
              path: 'newService',
              name: 'newService',
              component: NewService,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
              path: 'editService/:id',
              name: 'editService',
              component: EditService,
              props: true,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
          ]
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: Inventory,
          meta: { requiresAuth: true, requiresAdmin: true },
          children: [
            {
              path: '',
              name: 'inventoryList',
              component: InventoryList,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
              path: 'newInventory',
              name: 'newInventory',
              component: NewInventory,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
              path: 'editInventory/:id',
              name: 'editInventory',
              component: EditInventory,
              props: true,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
          ]
        },
        {
          path: 'dataCustomer',
          name: 'dataCustomer',
          component: DataCustomer,
          meta: { requiresAuth: true, requiresAdmin: true },
          children: [
            {
              path: '',
              name: 'dataCustomerList',
              component: DataCustomerList,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
              path: 'newCustomer',
              name: 'newCustomer',
              component: NewCustomer,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
              path: 'editCustomer/:id',
              name: 'editCustomer',
              component: EditCustomer,
              props: true,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
          ]
        },
        {
          path: 'dataTechnician',
          name: 'dataTechnician',
          component: DataTechnician,
          meta: { requiresAuth: true, requiresAdmin: true },
          children: [
            {
              path: '',
              name: 'dataTechnicianList',
              component: DataTechnicianList,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
              path: 'newTechnician',
              name: 'newTechnician',
              component: NewTechnician,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
              path: 'editTechnician/:id',
              name: 'editTechnician',
              component: EditTechnician,
              props: true,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
          ]
        },
        {
          path: 'dataAdmin',
          name: 'dataAdmin',
          component: DataAdmin,
          meta: { requiresAuth: true, requiresAdmin: true },
          children: [
            {
              path: '',
              name: 'dataAdminList',
              component: DataAdminList,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
              path: 'newAdmin',
              name: 'newAdmin',
              component: NewAdmin,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
              path: 'editAdmin/:id',
              name: 'editAdmin',
              component: EditAdmin,
              props: true,
              meta: { requiresAuth: true, requiresAdmin: true },
            },
          ]
        },
      ]
    },
    {
      path: '/customer',
      name: 'sidebarCust',
      component: SidebarCust,
      meta: { requiresAuth: true, requiresCustomer: true },
      children: [
        {
          path: 'status',
          name: 'status',
          component: StatusCust,
          meta: { requiresAuth: true, requiresCustomer: true },
          children: [
            {
              path: '',
              name: 'statusCustList',
              component: StatusCustList,
              meta: { requiresAuth: true, requiresCustomer: true },
            }
          ]
        },
      ]
    },
    {
      path: '/technician',
      name: 'sidebarTec',
      component: SidebarTec,
      meta: { requiresAuth: true, requiresTechnician: true },
      children: [
        {
          path: 'serviceTec',
          name: 'serviceTec',
          component: ServiceTec,
          meta: { requiresAuth: true, requiresTechnician: true },
          children: [
            {
              path: 'newServiceTec',
              name: 'newServiceTec',
              component: NewServiceTec,
              meta: { requiresAuth: true, requiresTechnician: true },
            },
            {
              path: '',
              name: 'serviceTecList',
              component: ServiceTecList,
              meta: { requiresAuth: true, requiresTechnician: true },
            },
            {
              path: 'editServiceTec/:id',
              name: 'editServiceTec',
              component: EditServiceTec,
              props: true,
              meta: { requiresAuth: true, requiresTechnician: true },
            },
          ]
        },
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  const token = localStorage.getItem('accessToken');

  if (!token && to.meta.requiresAuth) {
    console.log('Token not found, redirecting..');
    return '/';
  }
  if (!to.meta.requiresAuth) {
    return true;
  }


  try {
    const userInfo = await api.request('get', '/api/user', null, token);

    if (to.meta.requiresAuth && userInfo.user_type === 'admin') {
      if (to.meta.requiresAdmin) {
        console.log('admin detected, allowing access to admin routes');
        return true;
      }
      else if (!to.meta.requiresAdmin) {
        console.log("You're Admin");
        return '/admin';
      }
    }
    else if (to.meta.requiresAuth && userInfo.user_type === 'customer') {
      if (to.meta.requiresCustomer) {
        console.log('Customer detected, allowing access to customer routes');
        return true;
      }
      else if (!to.meta.requiresCustomer) {
        console.log("You're not Admin");
        return '/customer/status';
      }
    } else if (to.meta.requiresAuth && userInfo.user_type === 'technician') {
      if (to.meta.requiresTechnician) {
        console.log('Technician detected, allowing access to technician routes');
        return true;
      }
      else if (!to.meta.requiresTechnician) {
        console.log("You're not Admin");
        return '/technician/serviceTec';
      }
    }
    else {
      console.log('Unknown user detected, redirecting to home page');
      return '/';
    }
  }
  catch (error) {
    console.error('Error while fetching user info:', error);
    console.log('Redirecting to home page due to error');
    return '/';
  }
});

export default router
