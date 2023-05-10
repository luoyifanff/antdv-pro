import dayjs from 'dayjs'
import i18n, { loadLanguageAsync } from '~@/locales'
import 'dayjs/locale/zh-cn'

export const useI18nLocale = createSharedComposable(() => {
  // 加载多语言的loading状态
  const loading = ref(false)
  // 多语言的信息
  const locale = computed<string>(() => {
    return unref(i18n.global.locale)
  })

  // 获取antd的多语言
  const antd = computed(() => {
    return i18n.global.getLocaleMessage(locale.value)?.antd || undefined
  })

  // 切换多语言
  const setLocale = async (locale: string) => {
    if (loading.value) return
    loading.value = true
    try {
      // 加载多语言
      await loadLanguageAsync(locale)
      // 判断是否存在兼容模式
      if (i18n.mode === 'legacy')
        i18n.global.locale = locale as any
      else
        i18n.global.locale.value = locale as any

      loading.value = false
    }
    catch (e) {
      loading.value = false
    }
  }

  watch(locale, () => {
    dayjs.locale(antd.value.locale)
  }, {
    immediate: true,
  })

  // 切换多语言功能
  const t = (key: string, defaultMessage: string) => {
    // TODO
    const isExist = i18n.global.te(key, locale.value as any)
    if (isExist)
      return i18n.global.t(key)
    else
      return defaultMessage
  }
  return {
    locale,
    t,
    antd,
    setLocale,
  }
})
