import { Link } from 'react-router'
import logo from '../../assets/design/logo.svg'
import { PATHS } from '../constants/paths.js'
import { t } from '../i18n/index.js'

function Header() {
  return (
    <header className="header bg-white">
      <Link to={PATHS.HOME} className="header__logo">
        <img src={logo} alt={t('header.logoAlt')} />
      </Link>
      <nav aria-label={t('header.menuLabel')}>
        <Link
          to={PATHS.PRODUCTS}
          className="header__nav-link text-action color-white bg-navy hover-navy"
        >
          {t('header.productLink')}
        </Link>
      </nav>
    </header>
  )
}

export default Header
