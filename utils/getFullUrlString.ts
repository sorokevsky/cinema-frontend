export default function (urn: string): string {
  const runtimeConfig = useRuntimeConfig()
  return runtimeConfig.public.BASE_URL + urn
}
