export const FALLBACK_LG = 'https://placehold.co/800x600/E5E7EB/6B7280?text=Damage+Photo';
export const FALLBACK_SM = 'https://placehold.co/200x150/E5E7EB/6B7280?text=Angle';

const IMG = {
  bumper:  'https://images.unsplash.com/photo-1597007030739-6d2e7172ee0a?w=800&auto=format&fit=crop',
  bumper2: 'https://images.unsplash.com/photo-1605618826115-fb9e0eb5c5d6?w=400&auto=format&fit=crop',
  bumper3: 'https://images.unsplash.com/photo-1632823469850-2f77dd9c7d93?w=400&auto=format&fit=crop',
  bumper4: 'https://images.unsplash.com/photo-1583349562384-ad525c8c2860?w=400&auto=format&fit=crop',
  scratch: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800&auto=format&fit=crop',
  side:    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop',
};

export const claims = [
  {
    id: 'CLM-2024-001',
    name: 'Marcus Rivera',
    date: 'May 2, 2026',
    value: '$4,200',
    routing: 'agent',
    bannerTitle: 'Routed to agent review',
    rationale: 'Severity confidence 73% — below 80% auto-resolve threshold.',
    photo: IMG.bumper,
    thumbs: [IMG.bumper2, IMG.bumper3, IMG.bumper4],
    damageType: 'Front bumper, hood',
    panels: ['Front bumper', 'Hood', 'Right headlight assembly'],
    severity: 'Moderate',
    repairLow: 3800,
    repairHigh: 4600,
    confidence: { damage: 94, panel: 88, severity: 73, cost: 81 },
    overallConf: 73,
  },
  {
    id: 'CLM-2024-002',
    name: 'Priya Shah',
    date: 'May 1, 2026',
    value: '$1,180',
    routing: 'auto',
    bannerTitle: 'Auto-resolved',
    rationale: 'All confidence signals above threshold. Approved without review.',
    photo: IMG.scratch,
    thumbs: [IMG.bumper2, IMG.bumper4, IMG.bumper3],
    damageType: 'Rear quarter panel scratch',
    panels: ['Rear quarter panel (left)'],
    severity: 'Minor',
    repairLow: 950,
    repairHigh: 1300,
    confidence: { damage: 96, panel: 95, severity: 92, cost: 91 },
    overallConf: 93,
  },
  {
    id: 'CLM-2024-003',
    name: 'Daniel Okonkwo',
    date: 'Apr 30, 2026',
    value: '$11,800',
    routing: 'senior',
    bannerTitle: 'Escalated — fraud signal detected',
    rationale: 'Damage pattern inconsistent with reported incident. Flagged for senior adjuster review.',
    photo: IMG.side,
    thumbs: [IMG.bumper3, IMG.bumper2, IMG.bumper4],
    damageType: 'Driver-side door, side panel',
    panels: ['Driver door', 'Front fender (left)', 'Rocker panel'],
    severity: 'Severe',
    repairLow: 9200,
    repairHigh: 12400,
    confidence: { damage: 89, panel: 84, severity: 78, cost: 70 },
    overallConf: 80,
  },
];

export const auditLog = [
  { ts: '2026-05-04 14:32', id: 'CLM-2024-098', output: 'Severity: Moderate, $3,400-$4,100', action: 'Accepted', reason: '' },
  { ts: '2026-05-04 13:15', id: 'CLM-2024-097', output: 'Severity: Minor, $620-$840', action: 'Overridden', reason: 'Model missed damage' },
  { ts: '2026-05-04 11:48', id: 'CLM-2024-096', output: 'Severity: Severe, $8,800-$10,200', action: 'Accepted', reason: '' },
  { ts: '2026-05-03 16:21', id: 'CLM-2024-095', output: 'Severity: Moderate, $2,900-$3,500', action: 'Overridden', reason: 'Severity wrong' },
  { ts: '2026-05-03 10:04', id: 'CLM-2024-094', output: 'Severity: Minor, $410-$580', action: 'Accepted', reason: '' },
  { ts: '2026-05-02 17:55', id: 'CLM-2024-093', output: 'Severity: Moderate, $5,100-$5,900', action: 'Overridden', reason: 'Cost estimate off' },
];

export const routingGroups = [
  { key: 'agent',  label: 'Awaiting Agent Review',        dotCls: 'orange' },
  { key: 'auto',   label: 'Auto-Resolved',                dotCls: 'green' },
  { key: 'senior', label: 'Escalated to Senior Adjuster', dotCls: 'red' },
];
