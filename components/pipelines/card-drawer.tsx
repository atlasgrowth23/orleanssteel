'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, MapPin, Phone, Mail, Calendar, DollarSign } from 'lucide-react'
import { PipelineCard } from '@/types'

interface CardDrawerProps {
  card: PipelineCard | null
  open: boolean
  onClose: () => void
}

export function CardDrawer({ card, open, onClose }: CardDrawerProps) {
  if (!card) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>{card.company}</span>
          </SheetTitle>
          <SheetDescription>
            Pipeline lead details and contact information
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{card.company}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{card.city}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {card.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{card.phone}</span>
                </div>
              )}
              {card.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{card.email}</span>
                </div>
              )}
              {!card.phone && !card.email && (
                <div className="text-sm text-gray-500 italic">
                  No contact information available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Opportunity Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Opportunity Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Last contacted: Not available</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Estimated value: Not available</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button className="w-full" disabled>
              Send Message (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Schedule Call (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full" disabled>
              View History (Coming Soon)
            </Button>
          </div>

          {/* Raw Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Raw Lead Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(card, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
