// Swap this out for a real download <a> once the build is ready.
// To re-enable: delete this file and restore the btn-primary <a href={DOWNLOAD_URL}> in
// Nav.jsx, Hero.jsx, and DownloadSection.jsx.
export default function ComingSoonButton({ size = 'md' }) {
  const padding = size === 'sm' ? 'px-4 py-2 text-xs' : size === 'lg' ? 'px-8 py-3.5 text-base' : 'px-6 py-3 text-sm'

  return (
    <span
      aria-disabled="true"
      className={`inline-flex items-center gap-2 rounded-xl font-semibold cursor-not-allowed select-none
        bg-surface-3 text-text-muted border border-border-subtle ${padding}`}
    >
      Coming soon
    </span>
  )
}
