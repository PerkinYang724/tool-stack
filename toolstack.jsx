import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Search, X, Plus, ExternalLink, Clock, Users,
  TrendingUp, Copy, Trash2, Check, ArrowUpDown, Filter,
} from 'lucide-react'
import { supabase } from './src/supabase.js'

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = ['AI', 'Productivity', 'Design', 'Dev', 'Outreach', 'Finance', 'Marketing', 'Ops']

const CAT_STYLES = {
  AI:           'bg-teal-500/20 text-teal-300 border-teal-500/30',
  Design:       'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Productivity: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Dev:          'bg-green-500/20 text-green-300 border-green-500/30',
  Outreach:     'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Finance:      'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Marketing:    'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Ops:          'bg-slate-500/20 text-slate-300 border-slate-500/30',
}

const SORT_OPTIONS = [
  { value: 'recent',     label: 'Recent' },
  { value: 'oldest',     label: 'Oldest' },
  { value: 'most-tools', label: 'Most tools' },
  { value: 'az',         label: 'A–Z' },
]

// ── Seed Data ─────────────────────────────────────────────────────────────────
const ago = days => new Date(Date.now() - days * 86400000).toISOString()

const SEED_FOUNDERS = [
  {
    id: 'seed-1', name: 'Maya Chen', role: 'Solo Founder', company: 'Flowly',
    tools: [
      { name: 'Claude',        category: 'AI',           url: 'https://claude.ai' },
      { name: 'Cursor',        category: 'Dev',          url: 'https://cursor.sh' },
      { name: 'Vercel',        category: 'Dev',          url: 'https://vercel.com' },
      { name: 'Notion',        category: 'Productivity', url: 'https://notion.so' },
      { name: 'Resend',        category: 'Outreach',     url: 'https://resend.com' },
      { name: 'Lemon Squeezy', category: 'Finance',      url: 'https://lemonsqueezy.com' },
    ],
    updatedAt: ago(1),
  },
  {
    id: 'seed-2', name: 'James Okafor', role: 'CTO', company: 'Stackwise',
    tools: [
      { name: 'Claude',    category: 'AI',           url: 'https://claude.ai' },
      { name: 'Cursor',    category: 'Dev',          url: 'https://cursor.sh' },
      { name: 'Supabase',  category: 'Dev',          url: 'https://supabase.com' },
      { name: 'GitHub',    category: 'Dev',          url: 'https://github.com' },
      { name: 'Linear',    category: 'Productivity', url: 'https://linear.app' },
      { name: 'Datadog',   category: 'Ops',          url: 'https://datadoghq.com' },
      { name: 'Stripe',    category: 'Finance',      url: 'https://stripe.com' },
    ],
    updatedAt: ago(3),
  },
  {
    id: 'seed-3', name: 'Sofia Reyes', role: 'Designer & Founder', company: 'Craft Studio',
    tools: [
      { name: 'Midjourney', category: 'AI',           url: 'https://midjourney.com' },
      { name: 'Figma',      category: 'Design',       url: 'https://figma.com' },
      { name: 'Framer',     category: 'Design',       url: 'https://framer.com' },
      { name: 'Notion',     category: 'Productivity', url: 'https://notion.so' },
      { name: 'ConvertKit', category: 'Marketing',    url: 'https://convertkit.com' },
      { name: 'Gumroad',    category: 'Finance',      url: 'https://gumroad.com' },
    ],
    updatedAt: ago(5),
  },
  {
    id: 'seed-4', name: 'Liam Park', role: 'Growth Lead', company: 'Launchpad HQ',
    tools: [
      { name: 'ChatGPT',   category: 'AI',        url: 'https://chat.openai.com' },
      { name: 'Apollo.io', category: 'Outreach',  url: 'https://apollo.io' },
      { name: 'Instantly', category: 'Outreach',  url: 'https://instantly.ai' },
      { name: 'Beehiiv',   category: 'Marketing', url: 'https://beehiiv.com' },
      { name: 'Typefully', category: 'Marketing', url: 'https://typefully.com' },
      { name: 'Airtable',  category: 'Ops',       url: 'https://airtable.com' },
    ],
    updatedAt: ago(7),
  },
  {
    id: 'seed-5', name: 'Priya Nair', role: 'CEO', company: 'Meridian',
    tools: [
      { name: 'Claude',   category: 'AI',           url: 'https://claude.ai' },
      { name: 'Notion',   category: 'Productivity', url: 'https://notion.so' },
      { name: 'Slack',    category: 'Ops',          url: 'https://slack.com' },
      { name: 'Rippling', category: 'Ops',          url: 'https://rippling.com' },
      { name: 'Mercury',  category: 'Finance',      url: 'https://mercury.com' },
      { name: 'Ramp',     category: 'Finance',      url: 'https://ramp.com' },
      { name: 'Carta',    category: 'Finance',      url: 'https://carta.com' },
    ],
    updatedAt: ago(2),
  },
  {
    id: 'seed-6', name: 'Tom Brennan', role: 'Solo Founder', company: 'DevKit.so',
    tools: [
      { name: 'Perplexity',    category: 'AI',           url: 'https://perplexity.ai' },
      { name: 'Linear',        category: 'Productivity', url: 'https://linear.app' },
      { name: 'Cursor',        category: 'Dev',          url: 'https://cursor.sh' },
      { name: 'Railway',       category: 'Dev',          url: 'https://railway.app' },
      { name: 'PlanetScale',   category: 'Dev',          url: 'https://planetscale.com' },
      { name: 'Mintlify',      category: 'Dev',          url: 'https://mintlify.com' },
      { name: 'Lemon Squeezy', category: 'Finance',      url: 'https://lemonsqueezy.com' },
    ],
    updatedAt: ago(10),
  },
]

// ── Utilities ─────────────────────────────────────────────────────────────────
function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (mins < 2)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hrs < 24)   return `${hrs}h ago`
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function fuzzyScore(haystack, needle) {
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase().trim()
  if (!n) return 1
  if (h === n) return 100
  if (h.startsWith(n)) return 80
  if (h.includes(n)) return 60
  let ni = 0
  for (let hi = 0; hi < h.length && ni < n.length; hi++) {
    if (h[hi] === n[ni]) ni++
  }
  return ni === n.length ? 30 : 0
}

function founderScore(founder, query) {
  if (!query.trim()) return 1
  return Math.max(
    fuzzyScore(founder.name, query),
    fuzzyScore(founder.company, query),
    fuzzyScore(founder.role, query),
    ...founder.tools.map(t => fuzzyScore(t.name, query)),
  )
}

function exportMarkdown(founder) {
  const grouped = {}
  for (const cat of CATEGORIES) {
    const tools = founder.tools.filter(t => t.category === cat)
    if (tools.length) grouped[cat] = tools
  }
  return [
    `## ${founder.name} — ${founder.company}`,
    `**Role:** ${founder.role}`,
    '',
    ...Object.entries(grouped).map(([cat, tools]) =>
      `**${cat}:** ${tools.map(t => t.name).join(', ')}`
    ),
    '',
    `_Updated ${relativeTime(founder.updatedAt)}_`,
  ].join('\n')
}

// URL state sync
function readUrl() {
  const p = new URLSearchParams(window.location.search)
  return {
    search:     p.get('q') || '',
    toolName:   p.get('tool') || '',
    categories: p.get('cats') ? p.get('cats').split(',').filter(Boolean) : [],
    role:       p.get('role') || '',
    sort:       p.get('sort') || 'recent',
    filterMode: p.get('mode') || 'or',
  }
}

function pushUrl({ search, activeTool, activeCategories, activeRole, sort, filterMode }) {
  const p = new URLSearchParams()
  if (search)                  p.set('q', search)
  if (activeTool?.name)        p.set('tool', activeTool.name)
  if (activeCategories.length) p.set('cats', activeCategories.join(','))
  if (activeRole)              p.set('role', activeRole)
  if (sort !== 'recent')       p.set('sort', sort)
  if (filterMode !== 'or')     p.set('mode', filterMode)
  const qs = p.toString()
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
}

// ── ToolChip ──────────────────────────────────────────────────────────────────
function ToolChip({ tool, onClick, isActive }) {
  return (
    <span
      onClick={() => onClick(tool)}
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs cursor-pointer
        transition-all duration-150 select-none
        ${CAT_STYLES[tool.category] || CAT_STYLES.Ops}
        ${isActive ? 'ring-1 ring-white/40 brightness-125 scale-105' : 'hover:brightness-125'}
      `}
      style={{ fontFamily: 'DM Mono, monospace' }}
    >
      {tool.name}
      {tool.url && (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="opacity-40 hover:opacity-90 transition-opacity"
        >
          <ExternalLink size={9} />
        </a>
      )}
    </span>
  )
}

// ── TrendingBar ───────────────────────────────────────────────────────────────
function TrendingBar({ founders, activeTool, onToolClick }) {
  const trending = useMemo(() => {
    const counts = {}
    founders.forEach(f =>
      f.tools.forEach(t => {
        const key = t.name.toLowerCase()
        if (!counts[key]) counts[key] = { name: t.name, category: t.category, url: t.url || '', count: 0 }
        counts[key].count++
      })
    )
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 14)
  }, [founders])

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
        <TrendingUp size={13} />
        <span className="text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>Trending</span>
      </div>
      <div className="flex gap-1.5 flex-nowrap">
        {trending.map(tool => (
          <button
            key={tool.name}
            onClick={() => onToolClick(tool)}
            className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs shrink-0
              transition-all duration-150
              ${CAT_STYLES[tool.category] || CAT_STYLES.Ops}
              ${activeTool?.name.toLowerCase() === tool.name.toLowerCase()
                ? 'ring-1 ring-white/30 brightness-125 scale-105'
                : 'hover:brightness-125'
              }
            `}
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {tool.name}
            <span className="opacity-40">×{tool.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── FounderCard ───────────────────────────────────────────────────────────────
function FounderCard({ founder, activeTool, onToolClick, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [copied,        setCopied]        = useState(false)
  const confirmTimer = useRef(null)

  const grouped = useMemo(() => {
    const map = {}
    for (const cat of CATEGORIES) {
      const tools = founder.tools.filter(t => t.category === cat)
      if (tools.length) map[cat] = tools
    }
    return map
  }, [founder.tools])

  const handleCopy = () => {
    navigator.clipboard.writeText(exportMarkdown(founder)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDeleteClick = () => {
    if (confirmDelete) {
      clearTimeout(confirmTimer.current)
      onDelete(founder.id)
    } else {
      setConfirmDelete(true)
      confirmTimer.current = setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div className="
      rounded-xl border border-[#1E1E2E] bg-[#13131A] p-5
      flex flex-col gap-4
      transition-all duration-200
      hover:border-[#00E5CC]/40 hover:shadow-[0_0_24px_rgba(0,229,204,0.07)]
    ">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-[15px] leading-tight truncate">
            {founder.name}
          </h3>
          <p className="text-[#00E5CC] text-sm mt-0.5 truncate" style={{ fontFamily: 'DM Mono, monospace' }}>
            {founder.company}
          </p>
          <p className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>
            {founder.role}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1 text-slate-600 text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>
            <Clock size={11} />
            <span>{relativeTime(founder.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              title="Copy as markdown"
              className="text-slate-600 hover:text-slate-300 transition-colors"
            >
              {copied
                ? <Check size={13} className="text-green-400" />
                : <Copy size={13} />
              }
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1.5">
                <span className="text-red-400 text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>
                  remove?
                </span>
                <button
                  onClick={handleDeleteClick}
                  className="text-red-400 hover:text-red-300 text-xs font-semibold transition-colors"
                  style={{ fontFamily: 'DM Mono, monospace' }}
                >
                  yes
                </button>
                <button
                  onClick={() => { setConfirmDelete(false); clearTimeout(confirmTimer.current) }}
                  className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
                  style={{ fontFamily: 'DM Mono, monospace' }}
                >
                  no
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeleteClick}
                title="Remove stack"
                className="text-slate-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tools grouped by category */}
      <div className="flex flex-col gap-2">
        {Object.entries(grouped).map(([, tools]) => (
          <div key={tools[0].category} className="flex flex-wrap gap-1.5">
            {tools.map(tool => (
              <ToolChip
                key={tool.name}
                tool={tool}
                onClick={onToolClick}
                isActive={activeTool?.name.toLowerCase() === tool.name.toLowerCase()}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── FilterBar ─────────────────────────────────────────────────────────────────
function FilterBar({
  founders,
  activeCategories, onToggleCategory,
  filterMode, onToggleFilterMode,
  activeRole, onSetRole,
  sort, onSetSort,
  search, onSearch,
  activeTool, onClearTool,
  matchCount, totalCount,
  onClearAll,
}) {
  const hasFilters = activeCategories.length > 0 || search || activeTool || activeRole

  // Count founders per category
  const catCounts = useMemo(() => {
    const map = {}
    CATEGORIES.forEach(cat => {
      map[cat] = founders.filter(f => f.tools.some(t => t.category === cat)).length
    })
    return map
  }, [founders])

  // Unique roles
  const roles = useMemo(() => {
    const set = new Set(founders.map(f => f.role))
    return [...set].sort()
  }, [founders])

  return (
    <div className="flex flex-col gap-3">
      {/* Search + Sort row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search founders or tools…"
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="
              w-full bg-[#13131A] border border-[#1E1E2E] rounded-lg
              pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600
              focus:outline-none focus:border-[#00E5CC]/50 focus:ring-1 focus:ring-[#00E5CC]/10
              transition-all
            "
            style={{ fontFamily: 'DM Mono, monospace' }}
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={e => onSetSort(e.target.value)}
            className="
              appearance-none bg-[#13131A] border border-[#1E1E2E] rounded-lg
              pl-8 pr-3 py-2.5 text-xs text-slate-300
              focus:outline-none focus:border-[#00E5CC]/50 transition-all cursor-pointer
            "
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ArrowUpDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Categories row + AND/OR toggle */}
      <div className="flex items-start gap-2 flex-wrap">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {CATEGORIES.map(cat => {
            const isActive = activeCategories.includes(cat)
            return (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all duration-150
                  ${isActive
                    ? `${CAT_STYLES[cat]} scale-105`
                    : 'bg-transparent border-[#1E1E2E] text-slate-500 hover:border-slate-500 hover:text-slate-300'
                  }
                `}
                style={{ fontFamily: 'DM Mono, monospace' }}
              >
                {cat}
                <span className={`text-[10px] ${isActive ? 'opacity-60' : 'opacity-40'}`}>
                  {catCounts[cat]}
                </span>
              </button>
            )
          })}
        </div>

        {/* AND / OR toggle — only shown when 2+ categories selected */}
        {activeCategories.length >= 2 && (
          <button
            onClick={onToggleFilterMode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#1E1E2E] text-xs transition-all hover:border-slate-500"
            style={{ fontFamily: 'DM Mono, monospace' }}
            title={filterMode === 'or' ? 'Match ANY selected category' : 'Match ALL selected categories'}
          >
            <Filter size={10} className="text-slate-500" />
            <span className={filterMode === 'and' ? 'text-[#F5A623]' : 'text-slate-400'}>
              {filterMode === 'or' ? 'any' : 'all'}
            </span>
          </button>
        )}
      </div>

      {/* Role filter */}
      {roles.length > 1 && (
        <div className="flex gap-1.5 flex-wrap">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => onSetRole(activeRole === role ? '' : role)}
              className={`
                px-2.5 py-0.5 rounded-full text-xs border transition-all duration-150
                ${activeRole === role
                  ? 'bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/30 scale-105'
                  : 'bg-transparent border-[#1E1E2E] text-slate-500 hover:border-slate-500 hover:text-slate-300'
                }
              `}
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              {role}
            </button>
          ))}
        </div>
      )}

      {/* Active filters summary */}
      {hasFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeTool && (
            <div className="flex items-center gap-1.5 bg-[#00E5CC]/10 border border-[#00E5CC]/30 rounded-full px-2.5 py-0.5">
              <Users size={11} className="text-[#00E5CC]" />
              <span className="text-[#00E5CC] text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>
                {matchCount} using {activeTool.name}
              </span>
              <button onClick={onClearTool} className="text-[#00E5CC]/50 hover:text-[#00E5CC] transition-colors">
                <X size={11} />
              </button>
            </div>
          )}
          <span className="text-slate-600 text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>
            {matchCount} of {totalCount} stacks
          </span>
          <button
            onClick={onClearAll}
            className="text-slate-500 hover:text-slate-300 text-xs transition-colors flex items-center gap-1 ml-auto"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            <X size={11} /> Clear all
          </button>
        </div>
      )}
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
function EmptyState({ onSubmit }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="text-5xl opacity-20 select-none">∅</div>
      <div>
        <p className="text-slate-400 text-sm" style={{ fontFamily: 'DM Mono, monospace' }}>
          No stacks match your filters.
        </p>
        <p className="text-slate-600 text-xs mt-1" style={{ fontFamily: 'DM Mono, monospace' }}>
          Be the first to add a stack for this tool.
        </p>
      </div>
      <button
        onClick={onSubmit}
        className="mt-1 px-4 py-2 bg-[#00E5CC]/10 hover:bg-[#00E5CC]/20 border border-[#00E5CC]/30 text-[#00E5CC] rounded-lg text-sm transition-all"
        style={{ fontFamily: 'DM Mono, monospace' }}
      >
        + Submit your stack
      </button>
    </div>
  )
}

// ── ToolAutocomplete ──────────────────────────────────────────────────────────
function ToolAutocomplete({ value, onChange, allToolNames, placeholder, className }) {
  const [open,        setOpen]        = useState(false)
  const [highlighted, setHighlighted] = useState(-1)

  const suggestions = useMemo(() => {
    if (!value.trim()) return []
    const q = value.toLowerCase()
    return allToolNames
      .filter(n => n.toLowerCase().includes(q) && n.toLowerCase() !== q)
      .slice(0, 7)
  }, [value, allToolNames])

  const select = name => { onChange(name); setOpen(false); setHighlighted(-1) }

  const handleKeyDown = e => {
    if (!open || !suggestions.length) return
    if (e.key === 'ArrowDown')  { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)) }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setHighlighted(h => Math.max(h - 1, -1)) }
    if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); select(suggestions[highlighted]) }
    if (e.key === 'Escape')     setOpen(false)
  }

  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setHighlighted(-1) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        style={{ fontFamily: 'DM Mono, monospace' }}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[#1a1a26] border border-[#2a2a3e] rounded-lg overflow-hidden shadow-2xl">
          {suggestions.map((name, i) => (
            <button
              key={name}
              onMouseDown={() => select(name)}
              className={`
                w-full text-left px-3 py-2 text-sm transition-colors
                ${i === highlighted
                  ? 'bg-[#00E5CC]/10 text-[#00E5CC]'
                  : 'text-slate-300 hover:bg-white/5'
                }
              `}
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── CompletenessBar ───────────────────────────────────────────────────────────
function CompletenessBar({ tools }) {
  const covered = new Set(tools.filter(t => t.name.trim()).map(t => t.category))
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-500 text-xs shrink-0" style={{ fontFamily: 'DM Mono, monospace' }}>
        Coverage
      </span>
      <div className="flex gap-1">
        {CATEGORIES.map(cat => (
          <div
            key={cat}
            title={cat}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              covered.has(cat)
                ? (CAT_STYLES[cat] || '').split(' ')[0].replace('/20', '/80')
                : 'bg-[#1E1E2E]'
            }`}
          />
        ))}
      </div>
      <span className="text-slate-600 text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>
        {covered.size}/{CATEGORIES.length}
      </span>
    </div>
  )
}

// ── SubmitModal ───────────────────────────────────────────────────────────────
function SubmitModal({ founders, onClose, onSave }) {
  const [name,    setName]    = useState('')
  const [company, setCompany] = useState('')
  const [role,    setRole]    = useState('')
  const [tools,   setTools]   = useState([{ name: '', category: 'AI', url: '' }])
  const [errors,  setErrors]  = useState({})

  const returning = useMemo(() => {
    if (!name.trim()) return null
    return founders.find(f => f.name.toLowerCase() === name.trim().toLowerCase()) || null
  }, [name, founders])

  useEffect(() => {
    if (returning) {
      setCompany(returning.company)
      setRole(returning.role)
      setTools(returning.tools.map(t => ({ ...t })))
    }
  }, [returning])

  // All known tool names for autocomplete
  const allToolNames = useMemo(() => {
    const set = new Set()
    founders.forEach(f => f.tools.forEach(t => set.add(t.name)))
    return [...set].sort()
  }, [founders])

  const addTool    = () => setTools(prev => [...prev, { name: '', category: 'AI', url: '' }])
  const removeTool = idx => setTools(prev => prev.filter((_, i) => i !== idx))
  const updateTool = (idx, field, val) =>
    setTools(prev => prev.map((t, i) => i === idx ? { ...t, [field]: val } : t))

  const validate = () => {
    const e = {}
    if (!name.trim())    e.name    = 'Required'
    if (!company.trim()) e.company = 'Required'
    if (!role.trim())    e.role    = 'Required'
    if (!tools.some(t => t.name.trim())) e.tools = 'Add at least one tool'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSave({
      name:     name.trim(),
      company:  company.trim(),
      role:     role.trim(),
      tools:    tools.filter(t => t.name.trim()),
    })
  }

  const fieldClass = errKey => `
    w-full bg-[#0A0A0F] border rounded-lg px-3 py-2.5 text-sm text-slate-200
    placeholder-slate-600 focus:outline-none transition-all
    ${errors[errKey]
      ? 'border-red-500/50'
      : 'border-[#1E1E2E] focus:border-[#00E5CC]/50 focus:ring-1 focus:ring-[#00E5CC]/10'
    }
  `

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="
          relative w-full sm:max-w-lg bg-[#13131A] border border-[#1E1E2E]
          rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto
          p-6 flex flex-col gap-5
        "
        style={{ animation: 'slideUp 0.22s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-white text-xl font-normal" style={{ fontFamily: 'Instrument Serif, serif' }}>
              {returning ? 'Update your stack' : 'Add your stack'}
            </h2>
            {returning && (
              <p className="text-[#00E5CC] text-xs mt-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                Welcome back, {returning.name} — updating your stack
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors mt-0.5">
            <X size={20} />
          </button>
        </div>

        {/* Identity fields */}
        <div className="flex flex-col gap-3">
          {[
            { label: 'Your name',         val: name,    set: setName,    key: 'name',    ph: 'e.g. Sarah Kim' },
            { label: 'Company / Project', val: company, set: setCompany, key: 'company', ph: 'e.g. Pulse Analytics' },
            { label: 'Your role',         val: role,    set: setRole,    key: 'role',    ph: 'e.g. Solo Founder, CTO, Designer' },
          ].map(({ label, val, set, key, ph }) => (
            <div key={key}>
              <label className="text-slate-400 text-xs block mb-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                {label}
              </label>
              <input
                type="text"
                value={val}
                onChange={e => set(e.target.value)}
                placeholder={ph}
                className={fieldClass(key)}
                style={{ fontFamily: 'DM Mono, monospace' }}
              />
              {errors[key] && (
                <p className="text-red-400 text-xs mt-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>
                  {errors[key]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Tools */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-400 text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>Tools</label>
            {errors.tools && (
              <p className="text-red-400 text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>{errors.tools}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {tools.map((tool, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <ToolAutocomplete
                  value={tool.name}
                  onChange={val => updateTool(idx, 'name', val)}
                  allToolNames={allToolNames}
                  placeholder="Tool name"
                  className="
                    w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-3 py-2 text-sm
                    text-slate-200 placeholder-slate-600 focus:outline-none
                    focus:border-[#00E5CC]/50 focus:ring-1 focus:ring-[#00E5CC]/10 transition-all
                  "
                />
                <select
                  value={tool.category}
                  onChange={e => updateTool(idx, 'category', e.target.value)}
                  className="
                    bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-2 py-2 text-xs
                    text-slate-300 focus:outline-none focus:border-[#00E5CC]/50 transition-all cursor-pointer
                  "
                  style={{ fontFamily: 'DM Mono, monospace' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="url"
                  value={tool.url}
                  onChange={e => updateTool(idx, 'url', e.target.value)}
                  placeholder="URL"
                  className="
                    w-24 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-2 py-2 text-xs
                    text-slate-200 placeholder-slate-600 focus:outline-none
                    focus:border-[#00E5CC]/50 transition-all hidden sm:block
                  "
                  style={{ fontFamily: 'DM Mono, monospace' }}
                />
                {tools.length > 1 && (
                  <button onClick={() => removeTool(idx)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3">
            <button
              onClick={addTool}
              className="flex items-center gap-1.5 text-slate-500 hover:text-[#00E5CC] text-xs transition-colors"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              <Plus size={13} /> Add tool
            </button>
            <CompletenessBar tools={tools} />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="
            w-full py-3 bg-[#00E5CC] hover:bg-[#00E5CC]/90 active:scale-[0.98]
            text-[#0A0A0F] rounded-lg font-semibold text-sm
            transition-all duration-150
          "
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          {returning ? 'Update stack →' : 'Publish stack →'}
        </button>
      </div>
    </div>
  )
}

// ── DB helpers ────────────────────────────────────────────────────────────────
const dbToJs = row => ({
  id:        row.id,
  name:      row.name,
  role:      row.role,
  company:   row.company,
  tools:     row.tools,
  updatedAt: row.updated_at,
})

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const urlState = readUrl()

  const [founders,  setFounders]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [dbError,   setDbError]   = useState(null)

  const [search,           setSearch]           = useState(urlState.search)
  const [activeCategories, setActiveCategories] = useState(urlState.categories)
  const [filterMode,       setFilterMode]       = useState(urlState.filterMode)
  const [activeRole,       setActiveRole]       = useState(urlState.role)
  const [sort,             setSort]             = useState(urlState.sort)
  const [showModal,        setShowModal]        = useState(false)
  const [gridVisible,      setGridVisible]      = useState(true)

  const [activeTool, setActiveTool] = useState(() => {
    if (!urlState.toolName) return null
    for (const f of SEED_FOUNDERS) {
      const t = f.tools.find(t => t.name.toLowerCase() === urlState.toolName.toLowerCase())
      if (t) return t
    }
    return { name: urlState.toolName, category: 'AI', url: '' }
  })

  // Fetch all founders; seed DB on first load if empty
  async function fetchFounders() {
    const { data, error } = await supabase
      .from('founders')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) { setDbError(error.message); setLoading(false); return }

    if (data.length === 0) {
      const seed = SEED_FOUNDERS.map(f => ({
        id: f.id, name: f.name, role: f.role, company: f.company,
        tools: f.tools, updated_at: f.updatedAt,
      }))
      await supabase.from('founders').insert(seed)
      setFounders(SEED_FOUNDERS)
    } else {
      setFounders(data.map(dbToJs))
    }
    setLoading(false)
  }

  // Initial fetch + real-time subscription
  useEffect(() => {
    fetchFounders()

    const channel = supabase
      .channel('founders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'founders' }, fetchFounders)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // Sync URL
  useEffect(() => {
    pushUrl({ search, activeTool, activeCategories, activeRole, sort, filterMode })
  }, [search, activeTool, activeCategories, activeRole, sort, filterMode])

  // Animate grid on filter change
  useEffect(() => {
    setGridVisible(false)
    const t = setTimeout(() => setGridVisible(true), 120)
    return () => clearTimeout(t)
  }, [activeCategories, filterMode, search, activeTool, activeRole, sort])

  // Derived: filtered + sorted founders
  const filteredFounders = useMemo(() => {
    let results = founders.filter(f => {
      if (activeCategories.length > 0) {
        const cats = new Set(f.tools.map(t => t.category))
        const match = filterMode === 'and'
          ? activeCategories.every(c => cats.has(c))
          : activeCategories.some(c => cats.has(c))
        if (!match) return false
      }
      if (activeTool) {
        if (!f.tools.some(t => t.name.toLowerCase() === activeTool.name.toLowerCase())) return false
      }
      if (activeRole && f.role !== activeRole) return false
      if (search.trim() && founderScore(f, search) === 0) return false
      return true
    })

    if (sort === 'recent')     results = [...results].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    if (sort === 'oldest')     results = [...results].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
    if (sort === 'most-tools') results = [...results].sort((a, b) => b.tools.length - a.tools.length)
    if (sort === 'az')         results = [...results].sort((a, b) => a.name.localeCompare(b.name))
    if (search.trim() && sort === 'recent') {
      results = [...results].sort((a, b) => founderScore(b, search) - founderScore(a, search))
    }

    return results
  }, [founders, activeCategories, filterMode, activeTool, activeRole, search, sort])

  const toggleCategory = cat =>
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )

  const handleToolClick = tool =>
    setActiveTool(prev => prev?.name.toLowerCase() === tool.name.toLowerCase() ? null : tool)

  const handleDelete = async id => {
    setFounders(prev => prev.filter(f => f.id !== id))
    await supabase.from('founders').delete().eq('id', id)
  }

  const handleSave = async ({ name, company, role, tools }) => {
    const existing = founders.find(f => f.name.toLowerCase() === name.toLowerCase())
    const entry = {
      id:         existing?.id || uid(),
      name, company, role, tools,
      updated_at: new Date().toISOString(),
    }
    // Optimistic update
    setFounders(prev => {
      const idx = prev.findIndex(f => f.name.toLowerCase() === name.toLowerCase())
      const mapped = dbToJs(entry)
      if (idx >= 0) return prev.map((f, i) => i === idx ? mapped : f)
      return [mapped, ...prev]
    })
    setShowModal(false)
    await supabase.from('founders').upsert(entry)
  }

  const clearAll = () => {
    setActiveCategories([])
    setSearch('')
    setActiveTool(null)
    setActiveRole('')
    setFilterMode('or')
  }

  const hasFilters = activeCategories.length > 0 || search || activeTool || activeRole

  if (dbError) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <p className="text-red-400 font-mono text-sm">DB error: {dbError}</p>
    </div>
  )

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-[#0A0A0F] text-slate-200">

        {/* Nav */}
        <nav className="sticky top-0 z-40 border-b border-[#1E1E2E] bg-[#0A0A0F]/90 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-white text-xl" style={{ fontFamily: 'Instrument Serif, serif' }}>
                ToolStack
              </span>
              <span className="text-[#00E5CC]/50 text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>
                {founders.length} stacks
              </span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="
                px-4 py-2 bg-[#00E5CC] hover:bg-[#00E5CC]/90 active:scale-95
                text-[#0A0A0F] rounded-lg text-sm font-semibold
                transition-all duration-150
              "
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              + Add your stack
            </button>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-7">

          {/* Hero */}
          <div>
            <h1 className="text-3xl sm:text-4xl text-white leading-tight" style={{ fontFamily: 'Instrument Serif, serif' }}>
              What founders are actually using
            </h1>
            <p className="text-slate-500 text-sm mt-2" style={{ fontFamily: 'DM Mono, monospace' }}>
              Real stacks from the cohort — no sponsored picks, no fluff.
            </p>
          </div>

          {/* Trending */}
          <TrendingBar
            founders={founders}
            activeTool={activeTool}
            onToolClick={handleToolClick}
          />

          {/* Filters */}
          <FilterBar
            founders={founders}
            activeCategories={activeCategories}
            onToggleCategory={toggleCategory}
            filterMode={filterMode}
            onToggleFilterMode={() => setFilterMode(m => m === 'or' ? 'and' : 'or')}
            activeRole={activeRole}
            onSetRole={setActiveRole}
            sort={sort}
            onSetSort={setSort}
            search={search}
            onSearch={setSearch}
            activeTool={activeTool}
            onClearTool={() => setActiveTool(null)}
            matchCount={filteredFounders.length}
            totalCount={founders.length}
            onClearAll={clearAll}
          />

          {/* Results count (when no other filter summary shown) */}
          {!hasFilters && (
            <p className="text-slate-600 text-xs -mt-3" style={{ fontFamily: 'DM Mono, monospace' }}>
              Showing all {founders.length} stacks
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border-2 border-[#00E5CC]/30 border-t-[#00E5CC] rounded-full animate-spin" />
            </div>
          ) : (
            <div
              className={`
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
                transition-all duration-200
                ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
              `}
            >
              {filteredFounders.length === 0
                ? <EmptyState onSubmit={() => setShowModal(true)} />
                : filteredFounders.map(f => (
                  <FounderCard
                    key={f.id}
                    founder={f}
                    activeTool={activeTool}
                    onToolClick={handleToolClick}
                    onDelete={handleDelete}
                  />
                ))
              }
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <SubmitModal
          founders={founders}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}
