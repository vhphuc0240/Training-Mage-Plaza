export const LOGO_BANNER_URL = 'https://cdn1.avada.io/logo/avada_logo_transparent.png';
export const LOGO_URL =
  'https://cdn1.avada.io/logo/branding-2022/Logo%20n%E1%BB%81n%20transparent/Brandmark_PhienBanMauChinhTrenNenSang.png';
export const LOGO_WIDTH = 40;
const PRIMARY_COLOR = '#1983ff';
import logo from '../../public/logo.png';

const theme = {
  colors: {
    primary: PRIMARY_COLOR,
    secondary: 'white'
  },
  logo: {
    width: 144,
    height: 30,
    topBarSource: logo,
    url: '/',
    accessibilityLabel: 'Logo'
  }
};

export default theme;
