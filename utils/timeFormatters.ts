import { minutesToHours, secondsToMinutes, format } from 'date-fns'

export const getTimeFromMinutesString = (minutes: number): string => {
  const hours = minutesToHours(minutes)
  minutes -= hours * 60
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`
}

export const getTimeFromSecondsString = (seconds: number): string => {
  const hours = secondsToMinutes(seconds)
  seconds -= hours * 60
  return `${hours}:${seconds < 10 ? '0' : ''}${seconds}`
}

export const getFormattedDateString = (date: Date | string | number, dateStyle: string): string => {
  return format(date, dateStyle)
}
