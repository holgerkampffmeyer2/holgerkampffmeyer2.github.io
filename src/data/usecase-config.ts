export interface UseCaseConfig {
  label: string;
  icon: string;
  color: string;
}

export const USECASE_CONFIG: Record<string, UseCaseConfig> = {
  gym: { label: 'Gym Session', icon: 'gym', color: 'text-[var(--color-primary)]' },
  drive: { label: 'Drive / Relax', icon: 'drive', color: 'text-[var(--color-primary)]' },
  work: { label: 'Focus / Work', icon: 'work', color: 'text-[var(--color-primary)]' },
  party: { label: 'Pre-Party', icon: 'party', color: 'text-[var(--color-primary)]' }
};

export const USE_CASE_LABELS: Record<string, string> = {
  gym: 'Gym Session',
  drive: 'Drive / Relax',
  work: 'Focus / Work',
  party: 'Pre-Party'
};
