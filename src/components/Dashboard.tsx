'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClientComponentClient } from '@/lib/supabase'
import NoteForm from './NoteForm'
import NoteCard from './NoteCard'
import { LogOut, Plus } from 'lucide-react'

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

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async (noteData: Partial<Note>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ ...noteData, user_id: user?.id }])
        .select()
        .single()
      
      if (error) throw error
      setNotes(prev => [data, ...prev])
      setShowForm(false)
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const handleUpdateNote = async (noteData: Partial<Note>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', noteData.id)
        .select()
        .single()
      
      if (error) throw error
      setNotes(prev => prev.map(note => note.id === data.id ? data : note))
      setEditingNote(null)
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setNotes(prev => prev.filter(note => note.id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleTriggerReminder = (note: Note) => {
    // Play notification sound
    if ('Audio' in window) {
      const audio = new Audio('/notification.wav')
      audio.play().catch(() => {})
    }
    
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Reminder', {
        body: note.content,
        icon: '/favicon.ico'
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800">📝 Note Reminder</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New Note</span>
              </button>
              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(showForm || editingNote) && (
          <div className="mb-8">
            <NoteForm
              onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
              initialNote={editingNote || undefined}
              onCancel={() => {
                setShowForm(false)
                setEditingNote(null)
              }}
            />
          </div>
        )}

        <div className="grid gap-4">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No notes yet. Create your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={setEditingNote}
                onDelete={handleDeleteNote}
                onTriggerReminder={handleTriggerReminder}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}