
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const form = document.getElementById('message-form')
const input = document.getElementById('message-input')
const messagesEl = document.getElementById('messages')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const content = input.value.trim()
  if (!content) return
  await supabase.from('messages').insert([{ content }])
  input.value = ''
  loadMessages()
})

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, match => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[match]))
}

async function loadMessages() {
  const { data } = await supabase.from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  messagesEl.innerHTML = ''
  data.forEach(msg => {
    const note = document.createElement('div')
    note.className = 'note'
    note.style.setProperty('--rotate', `${Math.random() * 10 - 5}deg`)
    note.innerHTML = escapeHTML(msg.content)
    messagesEl.appendChild(note)
  })
}

loadMessages()
