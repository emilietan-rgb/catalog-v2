import { useState, useRef, useEffect } from 'react'
import './FilterChip.css'

function getInitials(name) {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function Checkbox({ checked }) {
  return (
    <span className={`fc-checkbox${checked ? ' fc-checkbox--on' : ''}`}>
      {checked && (
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1.5,6 4.5,9.5 10.5,2.5"/>
        </svg>
      )}
    </span>
  )
}

function GroupedListDropdown({ groups, value, onChange }) {
  const isSelected = o => value.includes(o)
  const handleToggle = o => {
    onChange(isSelected(o) ? value.filter(v => v !== o) : [...value, o])
  }
  return (
    <div className="fc-options-list">
      {groups.map((group, gi) => (
        <div key={group.label}>
          {gi > 0 && <div className="fc-group-divider" />}
          <div className="fc-group-label">{group.label}</div>
          {group.options.map(opt => (
            <button
              key={opt}
              className="fc-option"
              onMouseDown={e => { e.preventDefault(); handleToggle(opt) }}
            >
              <span className="fc-option-text">
                <span className="fc-option-name">{opt}</span>
              </span>
              <Checkbox checked={isSelected(opt)} />
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

function ListDropdown({ options, value, onChange, multi, showSearch, avatarType, getAvatarSrc, getMeta }) {
  const [q, setQ] = useState('')
  const vis = q ? options.filter(o => o.toLowerCase().includes(q.toLowerCase())) : options
  const isSelected = o => multi ? value.includes(o) : value === o

  const handleToggle = o => {
    if (multi) {
      onChange(isSelected(o) ? value.filter(v => v !== o) : [...value, o])
    } else {
      onChange(o)
    }
  }

  return (
    <>
      {showSearch && (
        <div className="fc-search-wrap">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5"/>
            <path d="M10.5 10.5L14 14"/>
          </svg>
          <input
            className="fc-search-input"
            autoFocus
            placeholder="Search…"
            value={q}
            onChange={e => setQ(e.target.value)}
            onMouseDown={e => e.stopPropagation()}
          />
        </div>
      )}
      <div className="fc-options-list">
        {vis.map(opt => (
          <button
            key={opt}
            className="fc-option"
            onMouseDown={e => { e.preventDefault(); handleToggle(opt) }}
          >
            {avatarType === 'photo' && (
              <img className="fc-avatar" src={getAvatarSrc?.(opt)} alt={opt} />
            )}
            {avatarType === 'initials' && (
              <span className="fc-avatar fc-avatar--initials">{getInitials(opt)}</span>
            )}
            <span className="fc-option-text">
              <span className="fc-option-name">{opt}</span>
              {getMeta?.(opt) && <span className="fc-option-meta">{getMeta(opt)}</span>}
            </span>
            {multi ? (
              <Checkbox checked={isSelected(opt)} />
            ) : (
              isSelected(opt) && (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,8 7,12 13,4"/>
                </svg>
              )
            )}
          </button>
        ))}
      </div>
    </>
  )
}

function DateDropdown({ value, onChange }) {
  const PRESETS = ['Coming week', 'Coming month', 'This week', 'This month', 'Last 3 months', 'This year']
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  return (
    <div className="fc-date-body">
      <div className="fc-date-pills">
        {PRESETS.map(p => (
          <button
            key={p}
            className={`fc-date-pill${value === p ? ' fc-date-pill--on' : ''}`}
            onMouseDown={e => { e.preventDefault(); onChange(p) }}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="fc-divider" />
      <div className="fc-custom-range">
        <span className="fc-custom-label">Custom range</span>
        <div className="fc-date-row">
          <input
            className="fc-date-input"
            placeholder="dd/mm/yyyy"
            value={from}
            onChange={e => setFrom(e.target.value)}
            onMouseDown={e => e.stopPropagation()}
          />
          <span className="fc-date-arrow">→</span>
          <input
            className="fc-date-input"
            placeholder="dd/mm/yyyy"
            value={to}
            onChange={e => setTo(e.target.value)}
            onMouseDown={e => e.stopPropagation()}
          />
        </div>
        <button
          className="fc-apply"
          onMouseDown={e => { e.preventDefault(); if (from && to) onChange(`${from} → ${to}`) }}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default function FilterChip({
  label, options = [], value, onChange,
  multi, showSearch, avatarType, getAvatarSrc, getMeta,
  type, groups
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const isEmpty = multi ? value.length === 0 : !value
  const count = multi ? value.length : 0

  const chipLabel = isEmpty
    ? null
    : multi && count > 1
    ? `${count} selected`
    : multi
    ? value[0]
    : value?.includes?.('→')
    ? 'Custom range'
    : value

  const showX = !isEmpty && (!multi || count === 1)
  const showCaret = isEmpty || (!isEmpty && multi && count > 1)

  const handleClear = e => {
    e.stopPropagation()
    onChange(multi ? [] : null)
    setOpen(false)
  }

  const handleListChange = v => {
    onChange(v)
    if (!multi) setOpen(false)
  }

  const handleDateChange = v => {
    onChange(v)
    setOpen(false)
  }

  return (
    <div className="fc-wrap" ref={ref}>
      <button
        className={`fc-chip${!isEmpty ? ' fc-chip--active' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {isEmpty ? (
          <>
            <span className="fc-plus">+</span>
            <span className="fc-text">{label}</span>
            <svg className="fc-caret" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4,6 8,10 12,6"/>
            </svg>
          </>
        ) : (
          <>
            <span className="fc-text">{label}: <strong>{chipLabel}</strong></span>
            {showX && <span className="fc-clear" onMouseDown={handleClear}>×</span>}
            {!showX && showCaret && (
              <svg className="fc-caret" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4,6 8,10 12,6"/>
              </svg>
            )}
          </>
        )}
      </button>

      {open && (
        <div className={`fc-dropdown${type === 'date' ? ' fc-dropdown--date' : ''}${avatarType || showSearch || groups ? ' fc-dropdown--wide' : ''}`}>
          {type === 'date' ? (
            <DateDropdown value={value} onChange={handleDateChange} />
          ) : groups ? (
            <GroupedListDropdown groups={groups} value={value} onChange={handleListChange} />
          ) : (
            <ListDropdown
              options={options}
              value={value}
              onChange={handleListChange}
              multi={!!multi}
              showSearch={!!showSearch}
              avatarType={avatarType}
              getAvatarSrc={getAvatarSrc}
              getMeta={getMeta}
            />
          )}
        </div>
      )}
    </div>
  )
}
