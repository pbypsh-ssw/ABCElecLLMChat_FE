import { PRODUCTS } from '../../../core/constants/database/products.js'
import { t } from '../../../core/i18n/index.js'
import ProductCard from '../components/ProductCard.jsx'
import { productCssVariables } from '../constants/cssVariables.js'
import '../design.css'

function ProductPage() {
  return (
    <section className="products bg-page" style={productCssVariables}>
      <p className="text-caption font-bold color-blue">
        {t('product.eyebrow')}
      </p>
      <h1 className="products__title text-heading-lg font-bold color-navy">
        {t('product.title')}
      </h1>
      <div className="products__grid">
        {PRODUCTS.map((product, index) => (
          <ProductCard key={product.id} product={product} order={index + 1} />
        ))}
      </div>
    </section>
  )
}

export default ProductPage
