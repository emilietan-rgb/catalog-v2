import './Pagination.css'

export default function Pagination({ page, rowsPerPage, total, onPage }) {
  const start = (page - 1) * rowsPerPage + 1
  const end = Math.min(page * rowsPerPage, total)
  return (
    <div className="pagination-bar">
      <span className="pg-rows">Rows per page</span>
      <select className="pg-select" value={rowsPerPage} readOnly>
        <option>10</option>
        <option>25</option>
        <option>50</option>
      </select>
      <span className="pg-info">{start}–{end} of {total}</span>
      <button className="pg-btn" onClick={() => onPage(page - 1)} disabled={page <= 1}>‹</button>
      <button className="pg-btn" onClick={() => onPage(page + 1)} disabled={end >= total}>›</button>
    </div>
  )
}
