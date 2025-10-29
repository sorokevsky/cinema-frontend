import { getSettings, type Settings } from "~/client"

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>()
  const loading = ref(false)
  const loaded = ref(false)

  const fetchSettings = async () => {
    if (loaded.value) return
    
    loading.value = true
    try {
      const settingsData = await getSettings({})
      
      settings.value = settingsData || {}
    } catch (error) {
      console.error('Ошибка загрузки настроек приложения:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    settings,
    fetchSettings
  }
})