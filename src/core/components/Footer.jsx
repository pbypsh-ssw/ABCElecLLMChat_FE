import { COMPANY } from '../constants/database/company.js'
import { t } from '../i18n/index.js'

function Footer() {
  return (
    <footer className="footer bg-surface">
      <p className="footer__title text-label font-bold color-navy">
        {t('footer.title')}
      </p>
      <p className="text-body-compact color-muted">
        {t('footer.contact', {
          address: t('footer.address'),
          phone: COMPANY.phone,
          fax: COMPANY.fax,
        })}
      </p>
      <p className="text-body-compact color-muted">{t('footer.copyright')}</p>
    </footer>
  )
}

export default Footer
