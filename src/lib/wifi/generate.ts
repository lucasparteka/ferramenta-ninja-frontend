export type WifiSecurity = 'WPA' | 'WEP' | 'nopass'

export type WifiOptions = {
  ssid: string
  password: string
  security: WifiSecurity
  hidden: boolean
}

function escapeWifi(value: string): string {
  return value.replace(/([\\;,":[\]])/g, '\\$1')
}

export function generateWifiString(options: WifiOptions): string {
  const { ssid, password, security, hidden } = options
  const s = escapeWifi(ssid)
  const p = security === 'nopass' ? '' : escapeWifi(password)
  return `WIFI:T:${security};S:${s};P:${p};H:${hidden};;`
}
