export const formatToHours = minutes => {
  const locale = "en-US"

  let minutesInHours = minutes % 60
  let fullHours = Math.floor(minutes / 60)

  let formattedMinutes = minutesInHours.toLocaleString(locale, {
    minimumIntegerDigits: 2
  })
  let formattedHours = fullHours.toLocaleString(locale)

  return `${formattedHours}h${formattedMinutes}`
}

export const formatDate = dateString => {
  if (!dateString) {
    return ""
  }

  let date = new Date(dateString)

  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}
