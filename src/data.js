export const FALLBACK_LG = 'https://placehold.co/800x600/E5E7EB/6B7280?text=Damage+Photo';
export const FALLBACK_SM = 'https://placehold.co/200x150/E5E7EB/6B7280?text=Angle';

const IMG = {
  // CLM-001: front-end collision damage
  frontHero:    'https://images.unsplash.com/photo-1605773912303-69b3c5f4ec83?w=900&auto=format&fit=crop&q=80',
  frontAngleA:  'https://images.unsplash.com/photo-1597007030739-6d2e7172ee0a?w=400&auto=format&fit=crop&q=80',
  frontAngleB:  'https://images.unsplash.com/photo-1632823469850-2f77dd9c7d93?w=400&auto=format&fit=crop&q=80',
  frontAngleC:  'https://images.unsplash.com/photo-1583349562384-ad525c8c2860?w=400&auto=format&fit=crop&q=80',

  // CLM-002: minor cosmetic scratches
  minorHero:    'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=900&auto=format&fit=crop&q=80',
  minorAngleA:  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&auto=format&fit=crop&q=80',
  minorAngleB:  'https://images.unsplash.com/photo-1605618826115-fb9e0eb5c5d6?w=400&auto=format&fit=crop&q=80',
  minorAngleC:  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&auto=format&fit=crop&q=80',

  // CLM-003: side panel / door damage (partial coverage)
  sideHero:     'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=900&auto=format&fit=crop&q=80',
  sideAngleA:   'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&auto=format&fit=crop&q=80',
};

export const claims = [
  {
    id: 'CLM-2024-001',
    name: 'Marcus Rivera',
    date: 'May 2, 2026',
    value: '$4,200',
    routing: 'agent',
    bannerTitle: 'Routed to agent review',
    rationale: 'Severity confidence 73% — damage is genuinely ambiguous between moderate and severe.',
    photo: IMG.frontHero,
    thumbs: [IMG.frontAngleA, IMG.frontAngleB, IMG.frontAngleC],
    expectedAngles: 3,
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
    photo: IMG.minorHero,
    thumbs: [IMG.minorAngleA, IMG.minorAngleB, IMG.minorAngleC],
    expectedAngles: 3,
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
    secondaryRationale:
      'Limited photo coverage (2/4 angles) contributed to fraud flag — system requires additional documentation for high-value claims.',
    photo: IMG.sideHero,
    thumbs: [IMG.sideAngleA],
    expectedAngles: 3,
    damageType: 'Driver-side door, side panel',
    panels: ['Driver door', 'Front fender (left)', 'Rocker panel'],
    severity: 'Severe',
    repairLow: 9200,
    repairHigh: 12400,
    confidence: { damage: 89, panel: 64, severity: 78, cost: 70 },
    overallConf: 75,
  },
];

export const initialAuditLog = [
  { ts: '2026-05-04 14:32', id: 'CLM-2024-098', output: 'Severity: Moderate, $3,400-$4,100', action: 'Accepted',   reason: '',                    agent: 'Sarah Chen' },
  { ts: '2026-05-04 13:15', id: 'CLM-2024-097', output: 'Severity: Minor, $620-$840',        action: 'Overridden', reason: 'Model missed damage', agent: 'Sarah Chen' },
  { ts: '2026-05-04 11:48', id: 'CLM-2024-096', output: 'Severity: Severe, $8,800-$10,200',  action: 'Accepted',   reason: '',                    agent: 'Marcus Lee' },
  { ts: '2026-05-03 16:21', id: 'CLM-2024-095', output: 'Severity: Moderate, $2,900-$3,500', action: 'Overridden', reason: 'Severity wrong',      agent: 'Sarah Chen' },
  { ts: '2026-05-03 10:04', id: 'CLM-2024-094', output: 'Severity: Minor, $410-$580',        action: 'Accepted',   reason: '',                    agent: 'Marcus Lee' },
  { ts: '2026-05-02 17:55', id: 'CLM-2024-093', output: 'Severity: Moderate, $5,100-$5,900', action: 'Overridden', reason: 'Cost estimate off',   agent: 'Sarah Chen' },
];

export const routingGroups = [
  { key: 'agent',  label: 'Awaiting Agent Review',        dotCls: 'orange' },
  { key: 'auto',   label: 'Auto-Resolved',                dotCls: 'green' },
  { key: 'senior', label: 'Escalated to Senior Adjuster', dotCls: 'red' },
];
