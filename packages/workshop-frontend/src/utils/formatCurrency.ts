const USD_AMOUNT_FORMATTER = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
})

export function formatUsdCost(cost: number): string {
  return `$${USD_AMOUNT_FORMATTER.format(cost)}`
}
