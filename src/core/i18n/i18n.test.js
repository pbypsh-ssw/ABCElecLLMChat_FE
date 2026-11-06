import { describe, expect, it } from 'vitest'
import { formatNumber, t } from './index.js'

describe('t', () => {
  it('키에 해당하는 문구를 돌려준다', () => {
    expect(t('product.title')).toBe('제품 안내')
  })

  it('자리표시자를 값으로 바꾼다', () => {
    expect(t('footer.contact', { address: 'A', phone: 'B', fax: 'C' })).toBe(
      '주소 : A 대표전화 : B 팩스 : C',
    )
  })

  it('번역이 없으면 키를 그대로 보여 준다', () => {
    expect(t('missing.key')).toBe('missing.key')
  })
})

describe('formatNumber', () => {
  it('옵션대로 숫자를 표시한다', () => {
    expect(formatNumber(1, { minimumIntegerDigits: 2 })).toBe('01')
  })
})
