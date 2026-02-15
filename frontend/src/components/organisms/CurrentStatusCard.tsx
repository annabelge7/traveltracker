'use client'

import { Card } from '@/components/atoms'
import { cn, formatRelativeDate } from '@/lib/utils'
import { MapPin, Home, Users, Bus } from 'lucide-react'

export interface CurrentStatus {
  location: string | null
  country: string | null
  hostel: string | null
  travelingWith: string | null
  nextDestination: string | null
  lastUpdate: string | null
}

export interface CurrentStatusCardProps {
  status: CurrentStatus
  className?: string
}

export function CurrentStatusCard({ status, className }: CurrentStatusCardProps) {
  const hasAnyData = status.location || status.hostel || status.travelingWith || status.nextDestination

  if (!hasAnyData) {
    return null
  }

  return (
    <Card variant="bordered" className={cn('bg-gradient-to-br from-blue-50 to-purple-50', className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-medium text-gray-600">Currently</span>
        {status.lastUpdate && (
          <span className="text-xs text-gray-400 ml-auto">
            Updated {formatRelativeDate(status.lastUpdate)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Location */}
        {(status.location || status.country) && (
          <StatusItem
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value={[status.location, status.country].filter(Boolean).join(', ')}
            color="text-blue-600"
          />
        )}

        {/* Hostel */}
        {status.hostel && (
          <StatusItem
            icon={<Home className="h-4 w-4" />}
            label="Staying at"
            value={status.hostel}
            color="text-purple-600"
          />
        )}

        {/* Traveling with */}
        {status.travelingWith && (
          <StatusItem
            icon={<Users className="h-4 w-4" />}
            label="Traveling with"
            value={status.travelingWith}
            color="text-green-600"
          />
        )}

        {/* Next destination */}
        {status.nextDestination && (
          <StatusItem
            icon={<Bus className="h-4 w-4" />}
            label="Next stop"
            value={status.nextDestination}
            color="text-orange-600"
          />
        )}
      </div>
    </Card>
  )
}

function StatusItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={cn('p-2 rounded-lg bg-white shadow-sm', color)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  )
}
