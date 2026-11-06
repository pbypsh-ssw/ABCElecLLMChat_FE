import { formatNumber, t } from '../../../core/i18n/index.js'
import { productToneColors } from '../constants/colors.js'

function ProductCard({ product, order }) {
  const specs = [
    { label: t('product.spec.id'), value: product.id },
    { label: t('product.spec.manual'), value: product.manual },
    { label: t('product.spec.warranty'), value: product.warranty },
    { label: t('product.spec.shipping'), value: product.shipping },
  ]

  return (
    <article className="product-card o-rounded bg-white">
      <div
        className="product-card__visual o-rounded"
        style={{ '--product-tone': productToneColors[product.id] }}
      >
        <span className="product-card__order text-micro color-muted">
          {formatNumber(order, { minimumIntegerDigits: 2 })}
        </span>
        <img src={product.image} alt="" />
      </div>
      <div className="product-card__body">
        <h2 className="product-card__name text-heading-md font-bold color-navy">
          {t(product.nameKey)}
        </h2>
        <p className="product-card__english text-label color-muted">
          {t(product.englishNameKey)}
        </p>
        <dl className="product-card__specs">
          {specs.map(({ label, value }) => (
            <div className="product-card__spec" key={label}>
              <dt className="text-label color-muted">{label}</dt>
              <dd className="product-card__value text-value font-bold color-navy">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}

export default ProductCard
