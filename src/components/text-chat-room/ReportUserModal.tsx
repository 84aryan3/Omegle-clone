
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DEFAULT_REPORT_REASONS } from '@/data/chat'
import { toast } from 'sonner'

interface ReportUserModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function ReportUserModal({ isOpen, onOpenChange }: ReportUserModalProps) {
  const [selectedReason, setSelectedReason] = useState<number | null>(null)
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error('Please select a reason for reporting')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const reason = DEFAULT_REPORT_REASONS.find((r) => r.id === selectedReason)
      toast.success(`Report submitted for: ${reason?.reason}`)
      setSelectedReason(null)
      setAdditionalDetails('')
      setIsSubmitting(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report User</DialogTitle>
          <DialogDescription>
            Help us keep Omegle Web safe. Please select the reason for your report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={selectedReason?.toString() || ''} onValueChange={(val) => setSelectedReason(Number(val))}>
            <div className="space-y-3">
              {DEFAULT_REPORT_REASONS.map((reason) => (
                <div key={reason.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value={reason.id.toString()} id={`reason-${reason.id}`} className="mt-1" />
                  <Label htmlFor={`reason-${reason.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium">{reason.reason}</div>
                    <div className="text-sm text-muted-foreground">{reason.description}</div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea
              id="details"
              placeholder="Provide any additional context that might help our moderation team..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedReason || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
