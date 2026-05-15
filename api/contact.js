import { Resend } from 'resend'

const allowedSubjects = [
  'Request a refund',
  'Installation or setup help',
  'Microphone or accessibility permissions',
  'License or download issue',
  'Bug report',
  'Feature request',
  'Billing question',
  'General question',
]

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitize(value) {
  return String(value || '').trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  const name = sanitize(req.body?.name)
  const email = sanitize(req.body?.email)
  const subject = sanitize(req.body?.subject)
  const message = sanitize(req.body?.message)

  if (!name || !email || !subject || !message) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'All fields are required' }))
  }

  if (!isValidEmail(email)) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Enter a valid email address' }))
  }

  if (!allowedSubjects.includes(subject)) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Invalid topic' }))
  }

  if (!process.env.RESEND_API_KEY) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Contact form is not configured' }))
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const to = process.env.CONTACT_TO_EMAIL || 'support@sound-guy.io'

  try {
    const { error } = await resend.emails.send({
      from: 'SoundGuy Support <support@sound-guy.io>',
      to,
      replyTo: email,
      subject: `[SoundGuy] ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Topic: ${subject}`,
        '',
        message,
      ].join('\n'),
    })

    if (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Failed to send message' }))
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message || 'Failed to send message' }))
  }
}
