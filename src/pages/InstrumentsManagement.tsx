import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { Search, RefreshCw, Plus, Trash2, Edit2, Filter, Download, Eye, EyeOff } from 'lucide-react'
import api from '../services/api'

interface Segment {
  id: string
  name: string
  displayName: string
}

interface Instrument {
  id: string
  symbol: string
  name: string
  segment: {
    id: string
    name: string
    displayName: string
  }
  exchange: string
  lotSize: number
  tickSize: number
  status: string
  isTradeable: boolean
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

const InstrumentsManagement = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingInstrument, setEditingInstrument] = useState<Instrument | null>(null)
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    segmentId: '',
    exchange: '',
    lotSize: 1,
    tickSize: 0.01,
    isTradeable: true
  })

  // Fetch segments
  const fetchSegments = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<Segment[] | { segments: Segment[] }>>('/segments')
      if (response.data.success) {
        // Handle both array and object response formats
        const data = response.data.data
        if (Array.isArray(data)) {
          setSegments(data)
        } else if (data && Array.isArray(data.segments)) {
          setSegments(data.segments)
        } else {
          setSegments([])
        }
      }
    } catch (error) {
      console.error('Error fetching segments:', error)
      setSegments([])
    }
  }, [])

  // Fetch instruments
  const fetchInstruments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('status', selectedStatus)
      if (selectedSegment !== 'all') {
        params.append('segmentId', selectedSegment)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }
      
      const response = await api.get<ApiResponse<{ instruments: Instrument[], total: number }>>(`/instruments?${params.toString()}`)
      if (response.data.success) {
        setInstruments(response.data.data.instruments || response.data.data as unknown as Instrument[])
      }
    } catch (error) {
      console.error('Error fetching instruments:', error)
      toast.error('Failed to fetch instruments')
    } finally {
      setLoading(false)
    }
  }, [selectedSegment, selectedStatus, searchQuery])

  useEffect(() => {
    fetchSegments()
  }, [fetchSegments])

  useEffect(() => {
    fetchInstruments()
  }, [fetchInstruments])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Toggle instrument status
  const toggleInstrumentStatus = async (instrument: Instrument) => {
    try {
      const newStatus = instrument.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      await api.patch(`/superadmin/instruments/${instrument.id}`, { status: newStatus })
      toast.success(`Instrument ${newStatus.toLowerCase()}`)
      fetchInstruments()
    } catch (error) {
      console.error('Error updating instrument:', error)
      toast.error('Failed to update instrument status')
    }
  }

  // Delete instrument
  const deleteInstrument = async (id: string, symbol: string) => {
    if (!confirm(`Are you sure you want to delete ${symbol}?`)) return
    
    try {
      await api.delete(`/superadmin/instruments/${id}`)
      toast.success('Instrument deleted successfully')
      fetchInstruments()
    } catch (error) {
      console.error('Error deleting instrument:', error)
      toast.error('Failed to delete instrument')
    }
  }

  // Save instrument (add or edit)
  const handleSaveInstrument = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingInstrument) {
        await api.patch(`/superadmin/instruments/${editingInstrument.id}`, formData)
        toast.success('Instrument updated successfully')
      } else {
        await api.post('/superadmin/instruments', formData)
        toast.success('Instrument added successfully')
      }
      
      setShowAddModal(false)
      setEditingInstrument(null)
      resetForm()
      fetchInstruments()
    } catch (error: any) {
      console.error('Error saving instrument:', error)
      toast.error(error.response?.data?.error || 'Failed to save instrument')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      symbol: '',
      name: '',
      segmentId: '',
      exchange: '',
      lotSize: 1,
      tickSize: 0.01,
      isTradeable: true
    })
  }

  // Open edit modal
  const openEditModal = (instrument: Instrument) => {
    setEditingInstrument(instrument)
    setFormData({
      symbol: instrument.symbol,
      name: instrument.name,
      segmentId: instrument.segment.id,
      exchange: instrument.exchange,
      lotSize: instrument.lotSize,
      tickSize: instrument.tickSize,
      isTradeable: instrument.isTradeable
    })
    setShowAddModal(true)
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Symbol', 'Name', 'Segment', 'Exchange', 'Lot Size', 'Tick Size', 'Status', 'Tradeable', 'Created At']
    const rows = instruments.map(inst => [
      inst.symbol,
      inst.name,
      inst.segment.displayName,
      inst.exchange,
      inst.lotSize,
      inst.tickSize,
      inst.status,
      inst.isTradeable ? 'Yes' : 'No',
      new Date(inst.createdAt).toLocaleDateString()
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `instruments_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter instruments locally
  const filteredInstruments = instruments.filter(inst => {
    const matchesSearch = !searchQuery || 
      inst.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Instruments Management</h1>
          <p className="text-gray-500 mt-1">Manage all trading instruments across segments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => {
              setEditingInstrument(null)
              resetForm()
              setShowAddModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Instrument
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-sm text-gray-500">Total Instruments</div>
          <div className="text-2xl font-bold text-gray-800">{instruments.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {instruments.filter(i => i.status === 'ACTIVE').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-sm text-gray-500">Inactive</div>
          <div className="text-2xl font-bold text-red-600">
            {instruments.filter(i => i.status === 'INACTIVE').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="text-sm text-gray-500">Segments</div>
          <div className="text-2xl font-bold text-blue-600">{segments.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search instruments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Segments</option>
              {segments.map(seg => (
                <option key={seg.id} value={seg.id}>{seg.displayName}</option>
              ))}
            </select>
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          
          <button
            onClick={fetchInstruments}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Instruments Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Size</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tick Size</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tradeable</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                    Loading instruments...
                  </td>
                </tr>
              ) : filteredInstruments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No instruments found
                  </td>
                </tr>
              ) : (
                filteredInstruments.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{inst.symbol}</td>
                    <td className="px-4 py-3 text-gray-700">{inst.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {inst.segment?.displayName || inst.segment?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{inst.exchange}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{inst.lotSize}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{inst.tickSize}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        inst.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {inst.isTradeable ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleInstrumentStatus(inst)}
                          className={`p-1.5 rounded hover:bg-gray-100 ${
                            inst.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'
                          }`}
                          title={inst.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        >
                          {inst.status === 'ACTIVE' ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => openEditModal(inst)}
                          className="p-1.5 rounded text-blue-600 hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteInstrument(inst.id, inst.symbol)}
                          className="p-1.5 rounded text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingInstrument ? 'Edit Instrument' : 'Add Instrument'}
            </h2>
            
            <form onSubmit={handleSaveInstrument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol *</label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BTCUSD"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bitcoin USD"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segment *</label>
                <select
                  name="segmentId"
                  value={formData.segmentId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Segment</option>
                  {segments.map(seg => (
                    <option key={seg.id} value={seg.id}>{seg.displayName}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exchange *</label>
                <input
                  type="text"
                  name="exchange"
                  value={formData.exchange}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MCX, NSE, BINANCE"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lot Size</label>
                  <input
                    type="number"
                    name="lotSize"
                    value={formData.lotSize}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tick Size</label>
                  <input
                    type="number"
                    name="tickSize"
                    value={formData.tickSize}
                    onChange={handleInputChange}
                    step="0.0001"
                    min="0.0001"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isTradeable"
                  id="isTradeable"
                  checked={formData.isTradeable}
                  onChange={(e) => setFormData(prev => ({ ...prev, isTradeable: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isTradeable" className="text-sm text-gray-700">Tradeable</label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingInstrument(null)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingInstrument ? 'Update' : 'Add'} Instrument
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstrumentsManagement
