import Product from '@/components/product/Product'
import NetWork from '@/components/network/NetWork'
import Ap3 from '@/components/network/Ap3'
import Ap4 from '@/components/network/Ap4'
import Air2 from '@/components/network/Air2'
import Help from '@/components/network/Help'

export default  [
    {
      path: '/product',
      name: 'Product', //产品选择页面
      component: Product
    },
    {
      path: '/network/ap3',
      name: 'Ap3', //AP联网步骤3
      component: Ap3
    },
    {
      path: '/network/ap4',
      name: 'Ap4', //AP联网步骤4
      component: Ap4
    },
    {
      path: '/network/air2',
      name: 'Air2', //air联网步骤2
      component: Air2
    },
    {
      path: '/network/help',
      name: 'Help', //联网首页
      component: Help
    },
    {
      path: '/network/:subname',
      name: 'NetWork', //联网首页
      component: NetWork
    },
  ]
