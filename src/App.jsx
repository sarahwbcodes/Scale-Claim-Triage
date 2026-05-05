import { useState, useEffect, useRef } from 'react';
import { claims, initialAuditLog, routingGroups, FALLBACK_LG, FALLBACK_SM } from './data.js';

const AGENT_NAME = 'Sarah Chen';

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

function formatTimestamp(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function modelOutputFor(claim) {
  return `Severity: ${claim.severity}, $${claim.repairLow.toLocaleString()}-$${claim.repairHigh.toLocaleString()}`;
}

function Sidebar({ selectedId, resolvedClaims, onSelect }) {
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
                items.map((c) => {
                  const resolved = resolvedClaims.has(c.id);
                  return (
                    <div
                      key={c.id}
                      className={[
                        'claim-item',
                        c.id === selectedId ? 'selected' : '',
                        resolved ? 'resolved' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => onSelect(c.id)}
                    >
                      <ImgWithFallback src={c.thumbs[0]} fallback={FALLBACK_SM} className="claim-thumb" />
                      <div className="claim-meta">
                        <div className="claim-id">
                          {c.id}
                          {resolved && <span className="resolved-check" aria-label="Resolved">✓</span>}
                        </div>
                        <div className="claim-name">{c.name}</div>
                        <div className="claim-conf">
                          {resolved ? 'Resolved' : `Confidence: ${c.overallConf}%`}
                        </div>
                      </div>
                    </div>
                  );
                })
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

function ClaimDetail({ claim, resolved, confirmation, onAccept, onOverride, onViewAuditLog }) {
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
        <div className="banner-body">
          <div>
            <span className="banner-title">{claim.bannerTitle}:</span>{' '}
            <span className="banner-rationale">{claim.rationale}</span>
          </div>
          {claim.secondaryRationale && (
            <div className="banner-secondary">{claim.secondaryRationale}</div>
          )}
        </div>
      </div>

      {confirmation && (
        <div className="confirmation-banner">
          <span className="confirmation-check">✓</span>
          <span>{confirmation}</span>
          <button className="confirmation-link" onClick={onViewAuditLog}>View Audit Log</button>
        </div>
      )}

      <div className="columns">
        <div>
          <ImgWithFallback src={claim.photo} fallback={FALLBACK_LG} className="photo-main" />
          <div className="photo-thumbs">
            {Array.from({ length: claim.expectedAngles ?? claim.thumbs.length }).map((_, i) => {
              const t = claim.thumbs[i];
              if (t) {
                return <ImgWithFallback key={i} src={t} fallback={FALLBACK_SM} className="photo-thumb" />;
              }
              return (
                <div key={i} className="photo-thumb missing">
                  <span>Angle not provided</span>
                </div>
              );
            })}
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
        <button className="btn btn-primary" onClick={onAccept} disabled={resolved}>
          {resolved ? 'Decision Recorded' : 'Accept Recommendation'}
        </button>
        <button className="btn btn-secondary" onClick={onOverride} disabled={resolved}>
          Override
        </button>
      </div>
    </>
  );
}

function AuditLogView({ entries }) {
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
            <th>Agent</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((r, i) => (
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
              <td>{r.agent || '—'}</td>
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

export default function App() {
  const [selectedId, setSelectedId] = useState('CLM-2024-001');
  const [view, setView] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [auditEntries, setAuditEntries] = useState(initialAuditLog);
  const [resolvedClaims, setResolvedClaims] = useState(new Set());
  const [confirmation, setConfirmation] = useState('');
  const confirmationTimer = useRef(null);

  const claim = claims.find((c) => c.id === selectedId);
  const isResolved = resolvedClaims.has(selectedId);

  const showConfirmation = (msg) => {
    setConfirmation(msg);
    clearTimeout(confirmationTimer.current);
    confirmationTimer.current = setTimeout(() => setConfirmation(''), 5000);
  };

  const recordDecision = (action, reason = '') => {
    const entry = {
      ts: formatTimestamp(),
      id: claim.id,
      output: modelOutputFor(claim),
      action,
      reason,
      agent: AGENT_NAME,
    };
    setAuditEntries((prev) => [entry, ...prev]);
    setResolvedClaims((prev) => {
      const next = new Set(prev);
      next.add(claim.id);
      return next;
    });
    showConfirmation('Decision recorded — see Audit Log');
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    setView('dashboard');
    setConfirmation('');
  };

  return (
    <div className="app">
      <Sidebar
        selectedId={selectedId}
        resolvedClaims={resolvedClaims}
        onSelect={handleSelect}
      />
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
            {auditEntries.length !== initialAuditLog.length && (
              <span className="tab-badge">{auditEntries.length - initialAuditLog.length}</span>
            )}
          </button>
        </div>
        <div className="main-content">
          {view === 'dashboard' ? (
            <ClaimDetail
              claim={claim}
              resolved={isResolved}
              confirmation={confirmation}
              onAccept={() => recordDecision('Accepted')}
              onOverride={() => setModalOpen(true)}
              onViewAuditLog={() => setView('audit')}
            />
          ) : (
            <AuditLogView entries={auditEntries} />
          )}
        </div>
      </main>

      <OverrideModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={(reason) => {
          setModalOpen(false);
          recordDecision('Overridden', reason);
        }}
      />
    </div>
  );
}
