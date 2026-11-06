import ko from './locales/ko.json'

const DEFAULT_LOCALE = 'ko'
const dictionaries = { ko }

// index.html의 lang을 현재 언어의 기준으로 삼는다. 번역이 빠진 문구는 한국어로 표시한다.
const locale = globalThis.document?.documentElement.lang || DEFAULT_LOCALE

export function t(key, params = {}) {
  const template =
    dictionaries[locale]?.[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key

  return template.replace(/\{(\w+)\}/g, (placeholder, name) =>
    String(params[name] ?? placeholder),
  )
}

export function formatNumber(value, options) {
  return new Intl.NumberFormat(locale, options).format(value)
}
