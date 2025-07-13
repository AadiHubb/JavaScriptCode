'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Repeat, Edit3, Trash2, Bell } from 'lucide-react'
import { format } from 'date-fns'

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

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onTriggerReminder: (note: Note) => void
}

export default function NoteCard({ note, onEdit, onDelete, onTriggerReminder }: NoteCardProps) {
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    if (!note.reminder_time) return

    const checkReminder = () => {
      const now = new Date()
      const reminderTime = new Date(note.reminder_time!)
      
      if (now >= reminderTime && !isAlarmTriggered) {
        setIsAlarmTriggered(true)
        onTriggerReminder(note)
      }
      
      // Calculate time remaining
      const diff = reminderTime.getTime() - now.getTime()
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeRemaining(`${hours}h ${minutes}m`)
      } else {
        setTimeRemaining('Due!')
      }
    }

    checkReminder()
    const interval = setInterval(checkReminder, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [note.reminder_time, isAlarmTriggered, onTriggerReminder, note])

  const getVisualEffectClass = () => {
    if (!isAlarmTriggered) return ''
    
    switch (note.visual_effect) {
      case 'shake':
        return 'animate-shake'
      case 'blink':
        return 'animate-blink'
      case 'bounce':
        return 'animate-bounce'
      case 'pulse':
        return 'animate-pulse'
      default:
        return 'animate-pulse'
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow ${getVisualEffectClass()}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
        </div>
        <div className="flex space-x-2 ml-2">
          <button
            onClick={() => onEdit(note)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {note.reminder_time && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
          <Clock size={14} />
          <span>{format(new Date(note.reminder_time), 'MMM d, yyyy HH:mm')}</span>
          {timeRemaining && (
            <span className={`px-2 py-1 rounded text-xs ${
              timeRemaining === 'Due!' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {timeRemaining}
            </span>
          )}
        </div>
      )}
      
      {note.is_recurring && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
          <Repeat size={14} />
          <span>Every {note.recurring_interval} {note.recurring_unit}</span>
        </div>
      )}
      
      {note.visual_effect && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
          <Bell size={14} />
          <span className="capitalize">{note.visual_effect} effect</span>
        </div>
      )}
      
      {isAlarmTriggered && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 text-sm font-medium">⏰ Reminder: {note.content}</p>
          <button
            onClick={() => setIsAlarmTriggered(false)}
            className="mt-1 text-xs text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}