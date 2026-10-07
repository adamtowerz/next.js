import { nextTestSetup } from 'e2e-utils'
import stripAnsi from 'strip-ansi'

// A catch-all in a route group's parallel slot must not claim pages that live
// in a sibling route group. `/settings` has a complete route through
// `(settings)` that never renders the `(dashboard)` layout or its `@modal` slot.
describe('parallel-routes-catchall-sibling-group', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('renders a page from a sibling route group', async () => {
    const $ = await next.render$('/settings')
    expect($('#children').text()).toBe('settings')
    expect($('#modal').length).toBe(0)
  })

  it('renders the slot catch-all alongside its own group pages', async () => {
    const $ = await next.render$('/tasks')
    expect($('#children').text()).toBe('dashboard tasks')
    expect($('#modal').text()).toBe('modal catch-all')
  })

  it('renders the slot default at the group root', async () => {
    const $ = await next.render$('/')
    expect($('#children').text()).toBe('dashboard home')
    expect($('#modal').text()).toBe('modal default')
  })

  it('does not report the sibling group page as unmatched', async () => {
    await next.render$('/settings')
    expect(stripAnsi(next.cliOutput)).not.toContain(
      'do not match any complete route'
    )
  })
})
