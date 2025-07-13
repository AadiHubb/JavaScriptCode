'use client'

import React, { useState } from 'react'
import { Plus, Calendar, Repeat, Sparkles } from 'lucide-react'

interface Note {
  id: string
  user_id: string
  content: string
  reminder_time: string | null
  is_recurring: boolean
  recurring_interval: number | null
  recurring_unit: 'minutes' | 'hours' | 'days' | null
  visual_effect: 'shake' | 'blink' | 'bounce' | 'pulse' | null
  created_at: string
  updated_at: string
}

interface NoteFormProps {
  onSubmit: (note: Partial<Note>) => void
  initialNote?: Note
  onCancel?: () => void
}

export default function NoteForm({ onSubmit, initialNote, onCancel }: NoteFormProps) {
  const [content, setContent] = useState(initialNote?.content || '')
  const [reminderTime, setReminderTime] = useState(
    initialNote?.reminder_time ? new Date(initialNote.reminder_time).toISOString().slice(0, 16) : ''
  )
  const [isRecurring, setIsRecurring] = useState(initialNote?.is_recurring || false)
  const [recurringInterval, setRecurringInterval] = useState(initialNote?.recurring_interval || 1)
  const [recurringUnit, setRecurringUnit] = useState<'minutes' | 'hours' | 'days'>(
    initialNote?.recurring_unit || 'hours'
  )
  const [visualEffect, setVisualEffect] = useState<'shake' | 'blink' | 'bounce' | 'pulse'>(
    initialNote?.visual_effect || 'pulse'
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const noteData: Partial<Note> = {
        content,
        reminder_time: reminderTime ? new Date(reminderTime).toISOString() : null,
        is_recurring: isRecurring,
        recurring_interval: isRecurring ? recurringInterval : null,
        recurring_unit: isRecurring ? recurringUnit : null,
        visual_effect: reminderTime ? visualEffect : null,
      }

      if (initialNote) {
        noteData.id = initialNote.id
      }

      await onSubmit(noteData)
      
      // Reset form if creating new note
      if (!initialNote) {
        setContent('')
        setReminderTime('')
        setIsRecurring(false)
        setRecurringInterval(1)
        setRecurringUnit('hours')
        setVisualEffect('pulse')
      }
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setLoading(false)
    }
  }

  const visualEffectOptions = [
    { value: 'shake', label: '🌊 Shake', description: 'Shaking water bottle effect' },
    { value: 'blink', label: '⏰ Blink', description: 'Blinking alarm clock effect' },
    { value: 'bounce', label: '⚡ Bounce', description: 'Bouncing effect' },
    { value: 'pulse', label: '💓 Pulse', description: 'Pulsing effect' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialNote ? 'Edit Note' : 'Create New Note'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Note Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter your note..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1" />
              Reminder Time (Optional)
            </label>
            <input
              id="reminder"
              type="datetime-local"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {reminderTime && (
            <div>
              <label htmlFor="visual-effect" className="block text-sm font-medium text-gray-700 mb-1">
                <Sparkles className="inline w-4 h-4 mr-1" />
                Visual Effect
              </label>
              <select
                id="visual-effect"
                value={visualEffect}
                onChange={(e) => setVisualEffect(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {visualEffectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {reminderTime && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <input
                id="recurring"
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                <Repeat className="inline w-4 h-4 mr-1" />
                Make this reminder recurring
              </label>
            </div>

            {isRecurring && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="interval" className="block text-xs font-medium text-gray-600 mb-1">
                    Every
                  </label>
                  <input
                    id="interval"
                    type="number"
                    min="1"
                    value={recurringInterval}
                    onChange={(e) => setRecurringInterval(parseInt(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="unit" className="block text-xs font-medium text-gray-600 mb-1">
                    Unit
                  </label>
                  <select
                    id="unit"
                    value={recurringUnit}
                    onChange={(e) => setRecurringUnit(e.target.value as any)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>{loading ? 'Saving...' : initialNote ? 'Update Note' : 'Create Note'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}