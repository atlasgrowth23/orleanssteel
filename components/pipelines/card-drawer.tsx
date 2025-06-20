'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PipelineCard } from '@/types'

interface CardDrawerProps {
  card: PipelineCard | null
  open: boolean
  onClose: () => void
}

export function CardDrawer({ card, open, onClose }: CardDrawerProps) {
  if (!open || !card) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full my-8" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{card.company}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Business Type */}
          <div>
            <p className="text-sm text-gray-500">Business Type</p>
            <p className="text-gray-900">{card.fullData?.query?.includes('fence') ? 'Fence Contractor' : 'General Contractor'}</p>
          </div>

          {/* Priority Contact Info */}
          <div className="bg-blue-50 p-3 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
            
            {/* Phone */}
            {card.phone && (
              <div className="mb-2">
                <span className="text-gray-900 font-medium">{card.phone}</span>
                {card.fullData?.['phone.phones_enricher.carrier_type'] === 'mobile' && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Mobile</span>
                )}
              </div>
            )}

            {/* Email */}
            {card.email && (
              <div className="mb-2">
                <span className="text-gray-900">{card.email}</span>
                {card.fullData?.['email_1.emails_validator.status'] && (
                  <span className={`ml-2 text-xs px-2 py-1 rounded ${
                    card.fullData['email_1.emails_validator.status'] === 'RECEIVING' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {card.fullData['email_1.emails_validator.status'] === 'RECEIVING' ? 'Validated ✓' : 'Invalid ✗'}
                  </span>
                )}
              </div>
            )}

            {/* Website */}
            {card.website && (
              <div>
                <a href={card.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {card.website}
                </a>
              </div>
            )}
          </div>

          {/* Location & Business Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Location & Business</h3>
            
            {/* Address */}
            {card.fullData?.full_address && (
              <div className="mb-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900">{card.fullData.full_address}</p>
              </div>
            )}

            {/* City */}
            {card.city && (
              <div className="mb-2">
                <p className="text-sm text-gray-500">Service Area</p>
                <p className="text-gray-900">{card.city}</p>
              </div>
            )}

            {/* Rating & Reviews */}
            {card.fullData?.rating && (
              <div className="mb-2">
                <p className="text-sm text-gray-500">Google Rating</p>
                <p className="text-gray-900">
                  {card.fullData.rating} stars
                  {card.fullData?.reviews && ` (${card.fullData.reviews} reviews)`}
                  {!card.fullData?.reviews && ' (No reviews)'}
                </p>
              </div>
            )}
          </div>

          {/* Business Intelligence */}
          {(card.fullData?.['site.company_insights.description'] || card.fullData?.['site.company_insights.linkedin_bio']) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Business Intelligence</h3>
              {card.fullData['site.company_insights.description'] && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500">Company Description</p>
                  <p className="text-gray-900 text-sm">{card.fullData['site.company_insights.description']}</p>
                </div>
              )}
              {card.fullData['site.company_insights.linkedin_bio'] && card.fullData['site.company_insights.linkedin_bio'] !== card.fullData['site.company_insights.description'] && (
                <div>
                  <p className="text-sm text-gray-500">LinkedIn Bio</p>
                  <p className="text-gray-900 text-sm">{card.fullData['site.company_insights.linkedin_bio']}</p>
                </div>
              )}
            </div>
          )}

          {/* Social Presence */}
          {(card.fullData?.facebook || card.fullData?.instagram || card.fullData?.linkedin) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Social Presence</h3>
              <div className="space-y-1">
                {card.fullData?.facebook && (
                  <a href={card.fullData.facebook} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">
                    Facebook Profile
                  </a>
                )}
                {card.fullData?.instagram && (
                  <a href={card.fullData.instagram} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">
                    Instagram
                  </a>
                )}
                {card.fullData?.linkedin && (
                  <a href={card.fullData.linkedin} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
