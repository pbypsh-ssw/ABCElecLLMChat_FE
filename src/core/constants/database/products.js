import dishwasherImage from '../../../assets/design/product-dishwasher.svg'
import ovenImage from '../../../assets/design/product-oven.svg'
import purifierImage from '../../../assets/design/product-purifier.svg'

export const PRODUCTS = [
  {
    id: 'ABC-100',
    nameKey: 'product.oven.name',
    englishNameKey: 'product.oven.englishName',
    image: ovenImage,
    manual: 'MAN-100',
    warranty: 'WAR-100',
    shipping: 'SHP-100',
  },
  {
    id: 'ABC-200',
    nameKey: 'product.dishwasher.name',
    englishNameKey: 'product.dishwasher.englishName',
    image: dishwasherImage,
    manual: 'MAN-200',
    warranty: 'WAR-200',
    shipping: 'SHP-200',
  },
  {
    id: 'ABC-300',
    nameKey: 'product.purifier.name',
    englishNameKey: 'product.purifier.englishName',
    image: purifierImage,
    manual: 'MAN-300',
    warranty: 'WAR-300',
    shipping: 'SHP-300',
  },
]
