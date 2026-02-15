'use client'

import { FilterChip } from '@/components/molecules'
import { cn } from '@/lib/utils'

export interface FilterBarProps {
  countries: string[]
  selectedCountry: string | null
  onCountryChange: (country: string | null) => void
  className?: string
}

export function FilterBar({
  countries,
  selectedCountry,
  onCountryChange,
  className,
}: FilterBarProps) {
  if (countries.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <FilterChip
        label="All"
        active={!selectedCountry}
        onSelect={() => onCountryChange(null)}
      />
      {countries.map((country) => (
        <FilterChip
          key={country}
          label={country}
          active={selectedCountry === country}
          onSelect={() => onCountryChange(country)}
          onRemove={selectedCountry === country ? () => onCountryChange(null) : undefined}
        />
      ))}
    </div>
  )
}
