'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ExperimentalConfirm from '@/components/ExperimentalConfirm';

interface Note {
  id: string;
  name: string;
  role: string;
  message: string;
  color: string;
  created_at: string;
}

const COLOR_BG: Record<string, string> = {
  white: '#f8f4ed', yellow: '#fff9c4', blue: '#dce9f8',
  pink: '#fde8ee', green: '#e4f4e0',
};

export default function AdminPage() {
  const params = useSearchParams();
  const router = useRouter();
  const key = params.get('key') ?? '';

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!key) { router.replace('/'); return; }

    fetch('/api/memoboard')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setNotes(data);
        else setError('Failed to load notes.');
      })
      .catch(() => setError('Network error.'))
      .finally(() => setLoading(false));
  }, [key, router]);

  const confirmDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleExecuteDelete = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;

    setPendingDeleteId(null);
    setDeleting(id);
    try {
      const res = await fetch(`/api/memoboard/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${key}` },
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } else {
        const body = await res.json();
        alert(body.error ?? 'Delete failed.');
      }
    } catch {
      alert('Network error.');
    } finally {
      setDeleting(null);
    }
  };

  if (!key) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0f0d0a', color: '#d4c5a9', fontFamily: 'monospace', padding: '40px 24px', cursor: 'auto' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.25em', color: '#8b6914', textTransform: 'uppercase', marginBottom: 6 }}>
            admin panel
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f5e6c8', margin: 0 }}>
            MemoBoard Notes
          </h1>
          <p style={{ fontSize: 12, color: '#6b7c5e', marginTop: 8 }}>
            {notes.length} note{notes.length !== 1 ? 's' : ''} · delete anything that doesn&apos;t belong
          </p>
        </div>

        {loading && <p style={{ color: '#8b6914' }}>Loading…</p>}
        {error && <p style={{ color: '#a0522d' }}>{error}</p>}

        {!loading && notes.length === 0 && !error && (
          <p style={{ color: '#6b7c5e', fontStyle: 'italic' }}>No notes yet.</p>
        )}

        {/* Notes grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {notes.map((note) => (
            <div key={note.id} style={{
              background: COLOR_BG[note.color] ?? '#f8f4ed',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 2,
              padding: '16px 16px 12px',
              position: 'relative',
            }}>
              {/* Timestamp */}
              <p style={{ fontSize: 10, color: '#999', marginBottom: 8, fontFamily: 'monospace' }}>
                {new Date(note.created_at).toLocaleString('id-ID')}
              </p>

              {/* Message */}
              <p style={{ fontSize: 13, color: '#2a1a00', lineHeight: 1.55, marginBottom: 12 }}>
                &ldquo;{note.message}&rdquo;
              </p>

              {/* Author */}
              <p style={{ fontSize: 11, fontWeight: 700, color: '#2a1a00', letterSpacing: '0.05em' }}>
                — {note.name}
              </p>
              <p style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{note.role}</p>

              {/* Delete button */}
              <button
                onClick={() => confirmDelete(note.id)}
                disabled={deleting === note.id}
                style={{
                  marginTop: 14,
                  width: '100%',
                  padding: '6px 0',
                  background: deleting === note.id ? '#888' : '#a0522d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 2,
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: deleting === note.id ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {deleting === note.id ? 'Deleting…' : '× Delete'}
              </button>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 60, fontSize: 11, color: '#333', borderTop: '1px solid #222', paddingTop: 20 }}>
          creative portfolio · admin · {new Date().getFullYear()}
        </p>
      </div>

      <ExperimentalConfirm
        isOpen={!!pendingDeleteId}
        message="This action is permanent and cannot be undone. The note will be lost in the void forever."
        onConfirm={handleExecuteDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
