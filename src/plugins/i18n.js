import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function setI18nLanguage (lang) {
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

const locale = process.env.VUE_APP_I18N_LOCALE || 'en'
const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en'

const messages = {
  [fallbackLocale]: require(`@/locales/${fallbackLocale}`)
}

const dateTimeFormats = {
  [fallbackLocale]: messages[fallbackLocale].dateTimeFormats
}

const i18n = new VueI18n({
  locale,
  fallbackLocale,
  messages,
  dateTimeFormats
})

export async function loadLanguageAsync (lang) {
  if (i18n.locale !== lang || !i18n.messages[lang]) {
    const importedMessages = await import(/* webpackChunkName: "lang-[request]" */ `@/locales/${lang}.json`)
    const { dateTimeFormats, ...rest } = importedMessages.default
    i18n.setLocaleMessage(lang, rest)
    i18n.setDateTimeFormat(lang, dateTimeFormats)
    return setI18nLanguage(lang)
  }
  return Promise.resolve(setI18nLanguage(lang))
}

export default i18n
