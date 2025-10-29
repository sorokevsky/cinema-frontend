// plugins/init.client.ts
export default defineNuxtPlugin(async () => {
  const settingsStore = useSettingsStore()

  try {
    await settingsStore.initSettings()
  }
  catch (err) {
    console.error('Ошибка инициализации приложения:', err)
    throw err
  }
})
