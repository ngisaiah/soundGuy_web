import { useState } from 'react'
import { usePostHog } from '@posthog/react'
import { Loader, Mail, Send } from 'lucide-react'
import { contactSubjects, SUPPORT_EMAIL } from '../data/siteContent'

const initialForm = {
  name: '',
  email: '',
  subject: contactSubjects[0],
  message: '',
}

export default function ContactSection() {
  const posthog = usePostHog()
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setStatus('idle')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('sending')
    setError('')
    posthog?.capture('contact_form_submitted', {
      subject: form.subject,
    })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(body.error || 'Could not send your message')
      }

      setForm(initialForm)
      setStatus('sent')
      posthog?.capture('contact_form_sent', {
        subject: form.subject,
      })
    } catch (err) {
      setError(err.message || 'Could not send your message')
      setStatus('error')
      posthog?.capture('contact_form_failed', {
        subject: form.subject,
        message: err.message || 'Could not send your message',
      })
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="section-label mb-3">Contact</p>
            <h2 className="section-heading">Need help with SoundGuy?</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
              SoundGuy includes a 7-day money-back guarantee. Send a support request and include the email you used at checkout for license, download, or refund questions.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              onClick={() => posthog?.capture('support_email_clicked')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-white"
            >
              <Mail size={15} />
              {SUPPORT_EMAIL}
            </a>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-text-secondary">Name</span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="w-full rounded-xl border border-border-soft bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-text-secondary">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className="w-full rounded-xl border border-border-soft bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-medium text-text-secondary">Topic</span>
              <select
                value={form.subject}
                onChange={(event) => updateField('subject', event.target.value)}
                className="w-full rounded-xl border border-border-soft bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent"
              >
                {contactSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-medium text-text-secondary">Message</span>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
                className="w-full resize-none rounded-xl border border-border-soft bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
                placeholder="Tell us what happened. For refunds, include the purchase email and any context that helps us find the order."
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
                {status === 'sending' ? 'Sending...' : 'Send request'}
              </button>
              {status === 'sent' && (
                <p className="text-xs text-green-400">
                  Message sent. We will reply by email.
                </p>
              )}
              {status === 'error' && (
                <p className="text-xs text-red-400">
                  {error}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
