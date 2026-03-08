function formatDate(dateString) {
  if (!dateString) return ""

  const [year, month, day] = dateString.slice(0, 10).split("-")
  const localDate = new Date(Number(year), Number(month) - 1, Number(day))

  return localDate.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}

export default formatDate