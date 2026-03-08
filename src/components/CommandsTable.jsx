import { commands } from '../data/commands'

export default function CommandsTable() {
  return (
    <section id="commands" className="py-24">
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Voice commands</p>
          <h2 className="section-heading">Speak. SoundGuy listens.</h2>
          <p className="mt-3 text-text-secondary text-sm max-w-md mx-auto">
            These built-in commands map to common DAW actions. You can add your own in the app.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block max-w-2xl mx-auto rounded-2xl border border-border-subtle overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-1">
                <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted w-1/2">
                  Say this
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Does this
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface-0">
              {commands.map(({ phrase, action }) => (
                <tr key={phrase} className="group hover:bg-surface-1 transition-colors duration-100">
                  <td className="px-6 py-4">
                    <span className="mono text-sm font-medium text-accent bg-accent-subtle px-2.5 py-1 rounded-lg border border-accent/15">
                      "{phrase}"
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card grid */}
        <div className="sm:hidden grid grid-cols-1 gap-3 max-w-md mx-auto">
          {commands.map(({ phrase, action }) => (
            <div key={phrase} className="card px-4 py-3.5 flex items-center justify-between gap-4">
              <span className="mono text-sm font-medium text-accent bg-accent-subtle px-2.5 py-1 rounded-lg border border-accent/15 shrink-0">
                "{phrase}"
              </span>
              <span className="text-sm text-text-secondary text-right">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
