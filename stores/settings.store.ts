import { getSettings, type Settings } from '~/client'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>()

  const initSettings = async (): Promise<void> => {
    try {
      const settingsData = await getSettings({})

      settings.value = settingsData || {}
    }
    catch (err) {
      console.error('Ошибка загрузки настроек приложения:', err)
    }
  }

  return {
    settings,
    initSettings,
  }
})
