import Breadcrumb from '../ui/Breadcrumb'

// Shared shell for content pages — consistent width, heading, spacing.
function StaticPage({ title, subtitle, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumb items={[{ to: '/', label: 'Home' }, { label: title }]} />
      <h1 className="mt-4 text-2xl font-semibold text-gray-900 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
      <div className="mt-8 space-y-8">{children}</div>
    </div>
  )
}

// Consistent section block used inside static pages.
export function PageSection({ heading, children }) {
  return (
    <section>
      {heading && <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>}
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">{children}</div>
    </section>
  )
}

export default StaticPage