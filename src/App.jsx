import { useState, useEffect, useRef } from 'react';
import { claims, auditLog, routingGroups, FALLBACK_LG, FALLBACK_SM } from './data.js';

function ImgWithFallback({ src, fallback, className, alt = '' }) {
  const onError = (e) => {
    if (e.target.src !== fallback) e.target.src = fallback;
  };
  return <img src={src} className={className} alt={alt} onError={onError} />;
}

function confClass(v) {
  if (v >= 85) return 'conf-high';
  if (v >= 75) return 'conf-mid';
  return 'conf-low';
}

function Sidebar({ selectedId, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Claims Queue</h2>
      </div>
      <div>
        {routingGroups.map((g) => {
          const items = claims.filter((c) => c.routing === g.key);
          return (
            <div className="sidebar-section" key={g.key}>
              <div className="section-header">
                <span className={`dot ${g.dotCls}`} />
                <span>{g.label}</span>
              </div>
              {items.length === 0 ? (
                <div className="claim-item empty">No claims</div>
              ) : (
                items.map((c) => (
                  <div
                    key={c.id}
                    className={`claim-item${c.id === selectedId ? ' selected' : ''}`}
                    onClick={() => onSelect(c.id)}
                  >
                    <ImgWithFallback src={c.thumbs[0]} fallback={FALLBACK_SM} className="claim-thumb" />
                    <div className="claim-meta">
                      <div className="claim-id">{c.id}</div>
                      <div className="claim-name">{c.name}</div>
                      <div className="claim-conf">Confidence: {c.overallConf}%</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function ConfidenceBars({ confidence }) {
  const rows = [
    ['Damage detection', confidence.damage],
    ['Panel identification', confidence.panel],
    ['Severity', confidence.severity],
    ['Cost estimate', confidence.cost],
  ];
  return (
    <div className="confidence-section">
      <div className="field-label" style={{ marginBottom: 10 }}>Confidence breakdown</div>
      {rows.map(([label, val]) => (
        <div className="confidence-row" key={label}>
          <div className="confidence-label">
            <span>{label}</span>
            <span style={{ fontWeight: 500 }}>{val}%</span>
          </div>
          <div className="confidence-bar-wrap">
            <div className={`confidence-bar ${confClass(val)}`} style={{ width: `${val}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ClaimDetail({ claim, onAccept, onOverride }) {
  const bannerCls =
    claim.routing === 'auto' ? 'green' : claim.routing === 'senior' ? 'red' : 'orange';

  return (
    <>
      <div className="claim-header">
        <div className="claim-header-left">
          <div className="claim-header-id">{claim.id}</div>
          <h1 className="claim-header-name">{claim.name}</h1>
          <div className="claim-header-date">Filed {claim.date}</div>
        </div>
        <div>
          <div className="claim-header-value-label">Claim value</div>
          <div className="claim-header-value">{claim.value}</div>
        </div>
      </div>

      <div className={`banner ${bannerCls}`}>
        <span className={`dot ${bannerCls}`} />
        <span>
          <span className="banner-title">{claim.bannerTitle}:</span>{' '}
          <span className="banner-rationale">{claim.rationale}</span>
        </span>
      </div>

      <div className="columns">
        <div>
          <ImgWithFallback src={claim.photo} fallback={FALLBACK_LG} className="photo-main" />
          <div className="photo-thumbs">
            {claim.thumbs.map((t, i) => (
              <ImgWithFallback key={i} src={t} fallback={FALLBACK_SM} className="photo-thumb" />
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="card-title">Assessment</h3>
          <div className="field">
            <div className="field-label">Damage type</div>
            <div className="field-value">{claim.damageType}</div>
          </div>
          <div className="field">
            <div className="field-label">Affected panels</div>
            <div className="field-value">{claim.panels.join(', ')}</div>
          </div>
          <div className="field">
            <div className="field-label">Severity</div>
            <div>
              <span className={`severity-badge severity-${claim.severity}`}>{claim.severity}</span>
            </div>
          </div>
          <div className="field">
            <div className="field-label">Estimated repair range</div>
            <div className="field-value">
              ${claim.repairLow.toLocaleString()} – ${claim.repairHigh.toLocaleString()}
            </div>
          </div>
          <ConfidenceBars confidence={claim.confidence} />
        </div>
      </div>

      <div className="action-bar">
        <button className="btn btn-primary" onClick={onAccept}>Accept Recommendation</button>
        <button className="btn btn-secondary" onClick={onOverride}>Override</button>
      </div>
    </>
  );
}

function AuditLogView() {
  return (
    <>
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 4px 0' }}>Audit Log</h1>
      <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
        Recent agent decisions on model recommendations.
      </p>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Claim ID</th>
            <th>Model Output</th>
            <th>Agent Action</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {auditLog.map((r, i) => (
            <tr key={i}>
              <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{r.ts}</td>
              <td style={{ fontWeight: 500 }}>{r.id}</td>
              <td>
                <div className="truncate" title={r.output}>{r.output}</div>
              </td>
              <td>
                <span className={`action-pill action-${r.action}`}>{r.action}</span>
              </td>
              <td style={{ color: 'var(--text-muted)' }}>{r.reason || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

const OVERRIDE_REASONS = [
  'Model missed damage',
  'Severity wrong',
  'Cost estimate off',
  'Fraud suspected',
  'Other',
];

function OverrideModal({ open, onCancel, onSubmit }) {
  const [reason, setReason] = useState(OVERRIDE_REASONS[0]);
  const [context, setContext] = useState('');

  useEffect(() => {
    if (!open) {
      setReason(OVERRIDE_REASONS[0]);
      setContext('');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal">
        <h3 className="modal-title">Override Recommendation</h3>
        <div className="modal-field">
          <label htmlFor="override-reason">Reason for override</label>
          <select id="override-reason" value={reason} onChange={(e) => setReason(e.target.value)}>
            {OVERRIDE_REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label htmlFor="override-context">Additional context</label>
          <textarea
            id="override-context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add any relevant details..."
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSubmit(reason)}>Submit Override</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message }) {
  return <div className={`toast${message ? ' show' : ''}`}>{message}</div>;
}

export default function App() {
  const [selectedId, setSelectedId] = useState('CLM-2024-001');
  const [view, setView] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const claim = claims.find((c) => c.id === selectedId);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    setView('dashboard');
  };

  return (
    <div className="app">
      <Sidebar selectedId={selectedId} onSelect={handleSelect} />
      <main className="main">
        <div className="main-toolbar">
          <button
            className={`tab${view === 'dashboard' ? ' active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            Claim Detail
          </button>
          <button
            className={`tab${view === 'audit' ? ' active' : ''}`}
            onClick={() => setView('audit')}
          >
            Audit Log
          </button>
        </div>
        <div className="main-content">
          {view === 'dashboard' ? (
            <ClaimDetail
              claim={claim}
              onAccept={() => showToast(`Accepted recommendation for ${claim.id}`)}
              onOverride={() => setModalOpen(true)}
            />
          ) : (
            <AuditLogView />
          )}
        </div>
      </main>

      <OverrideModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={(reason) => {
          setModalOpen(false);
          showToast(`Override submitted: ${reason}`);
        }}
      />

      <Toast message={toast} />
    </div>
  );
}
