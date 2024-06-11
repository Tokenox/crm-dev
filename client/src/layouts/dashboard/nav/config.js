// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [

  {
    title: 'Deals',
    path: '/dashboard/deals',
    icon: icon('ic_cart')
  },
  
  {
    title: 'Pay',
    path: '/dashboard/pay',
    icon: icon('ic_user')
  },
  {
    title: 'Users',
    path: '/dashboard/user',
    icon: icon('ic_user'),
    isSuperAdmin: true
  },
  {
    title: 'Resources',
    path: '/dashboard/blog',
    icon: icon('ic_blog')
  },
  {
    title: 'VC Dashboard',
    path: '/dashboard/vcdash',
    icon: icon('ic_blog')
  },

  // {
  //   title: 'Rookies',
  //   path: '/dashboard/rookies',
  //   icon: icon('ic_cart')
  // },
  // {
  //   title: 'Listings',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart')
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog')
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock')
  // },
  // {
  //   title: 'Leads',
  //   path: '/dashboard/leads',
  //   icon: icon('ic_blog')
  // },
  {
    title: 'Dynamic-Leads',
    path: '/dashboard/dynamic-leads',
    icon: icon('ic_analytics'),
    isSuperAdmin: true
  },
  {
    title: 'Planner',
    path: '/dashboard/planner',
    icon: icon('ic_analytics'),
    isSuperAdmin: true
  },
  {
    title: 'Availability',
    path: '/dashboard/availability-planner',
    icon: icon('ic_analytics'),
    isSuperAdmin: true
  }
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled')
  // }
];

export default navConfig;
