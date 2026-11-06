import heroProducts from '../../../assets/design/hero-products.svg'
import { t } from '../../../core/i18n/index.js'
import { homeCssVariables } from '../constants/cssVariables.js'
import '../design.css'

function HomePage() {
  return (
    <section className="home" style={homeCssVariables}>
      <div className="home__copy">
        <p className="text-body font-bold color-blue">{t('home.eyebrow')}</p>
        <h1 className="home__title text-display font-bold color-navy">
          {t('home.titleLine1')}
          <br />
          {t('home.titleLine2')}
        </h1>
        <p className="home__description text-lead color-muted">
          {t('home.description')}
        </p>
        <p className="home__collection text-caption font-bold color-blue">
          {t('home.collection')}
        </p>
      </div>
      <img className="home__visual" src={heroProducts} alt="" />
    </section>
  )
}

export default HomePage
