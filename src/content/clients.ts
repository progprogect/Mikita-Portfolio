export interface Client {
  name: string;
  logo: string;
  /** true when the logo artwork is dark and needs a light backing in a dark theme */
  invert?: boolean;
}

export const clientsSection = {
  title: 'Trusted by',
  lead: 'Shipped to production and trained client teams at global brands and industrial companies.',
  note: 'Also delivered ML systems for AMC — including a content placement model generating $1M+/month in additional ad revenue.',
} as const;

export const clients: Client[] = [
  { name: "McDonald's", logo: 'assets/logos/logo-mcdonalds.svg' },
  { name: 'Huawei', logo: 'assets/logos/logo-huawei.svg' },
  { name: 'Coca-Cola', logo: 'assets/logos/coca-cola.png' },
  { name: 'Yango Tech', logo: 'assets/logos/yango-tech.jpg' },
  { name: 'Hikrobot', logo: 'assets/logos/logo-hikrobot.svg' },
  { name: 'Echo', logo: 'assets/logos/logo-echo.svg' },
  { name: 'Infuse', logo: 'assets/logos/logo-infuse.svg' },
  { name: 'Shvedoff', logo: 'assets/logos/logo-shvedoff.svg' },
];
