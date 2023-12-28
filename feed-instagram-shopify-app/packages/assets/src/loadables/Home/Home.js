import Loadable from 'react-loadable';
import Loading from '@assets/components/Loading';

// eslint-disable-next-line new-cap
export default Loadable({
  loader: () => import('../../pages/Home/Home'),
  loading: Loading
});
