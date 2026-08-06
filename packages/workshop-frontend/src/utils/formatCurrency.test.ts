import { describe, expect, it } from 'vitest'

import { formatUsdCost } from './formatCurrency'

describe('formatUsdCost', () => {
  it('uses Brazilian decimal separators while keeping four decimal places', () => {
    expect(formatUsdCost(0.1234)).toBe('$0,1234')
    expect(formatUsdCost(1.2)).toBe('$1,2000')
  })
})
