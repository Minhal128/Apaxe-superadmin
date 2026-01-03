import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApiSubmit } from '@/hooks/useApi'
import { utilityApi, dashboardApi } from '@/services/api'
import { toast } from 'sonner'

// Segment type definition
interface Segment {
  id: string
  name: string
  type: string
  displayName: string
  isActive: boolean
}

export default function AutoSquareOff() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [loadingSegments, setLoadingSegments] = useState(true)
  const [config, setConfig] = useState({
    segmentId: '',
    enabled: false,
    time: '15:30',
    marginThreshold: 80,
    lossThreshold: 50
  })

  // Fetch segments on mount
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await dashboardApi.getSegments(true)
        const segmentData = response.data?.segments || response.data?.data?.segments || []
        setSegments(segmentData)
      } catch (error) {
        console.error('Failed to fetch segments:', error)
        toast.error('Failed to load segments')
      } finally {
        setLoadingSegments(false)
      }
    }
    fetchSegments()
  }, [])

  // We'll need an API to fetch current config, adding placeholder for now
  // since the backend only has POST for it currently.
  const { submit, loading: saving } = useApiSubmit(utilityApi.configureAutoSquareOff, {
    onSuccess: () => {
      toast.success('Auto square-off configuration updated successfully')
    },
    onError: (err) => {
      toast.error('Failed to update configuration: ' + err)
    }
  })

  const handleChange = (field: string, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!config.segmentId) {
      toast.error('Please select a segment')
      return
    }
    await submit(config)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Auto-square off Configuration</h1>
      </div>

      <div className="p-4 sm:p-6 flex-1 max-w-4xl mx-auto w-full">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Segment</Label>
                <Select
                  value={config.segmentId}
                  onValueChange={(val) => handleChange('segmentId', val)}
                  disabled={loadingSegments}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingSegments ? "Loading segments..." : "Select Segment"} />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.displayName || segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Select the market segment for these rules</p>
              </div>

              <div className="space-y-2">
                <Label>Enabled</Label>
                <div className="flex items-center space-x-2 h-10">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={config.enabled}
                    onChange={(e) => handleChange('enabled', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <Label htmlFor="enabled" className="text-sm font-normal">Activate automatic square-off</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Square-off Time (HH:mm)</Label>
                <Input
                  type="time"
                  value={config.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                />
                <p className="text-xs text-gray-500">Time when all open positions will be closed</p>
              </div>

              <div className="space-y-2">
                <Label>Margin Threshold (%)</Label>
                <Input
                  type="number"
                  value={config.marginThreshold}
                  onChange={(e) => handleChange('marginThreshold', parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500">Square off when margin utilization reaches this %</p>
              </div>

              <div className="space-y-2">
                <Label>Loss Threshold (%)</Label>
                <Input
                  type="number"
                  value={config.lossThreshold}
                  onChange={(e) => handleChange('lossThreshold', parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500">Square off when unrealized loss exceeds this % of balance</p>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Configuration
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-100 italic text-sm text-blue-800">
          <p>
            <strong>Warning:</strong> Auto square-off will automatically close all active positions for the selected segment when thresholds are met or at the specified time. This action is irreversible.
          </p>
        </Card>
      </div>
    </div>
  )
}