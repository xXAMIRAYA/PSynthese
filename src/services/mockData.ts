
import { User, Campaign, Donation, Badge, DashboardStats } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@healthsolidarity.com',
    role: 'admin',
    avatarUrl: 'https://source.unsplash.com/random/300x300/?portrait',
    createdAt: '2023-01-15T08:30:00.000Z',
    donationsCount: 12,
    totalDonated: 2500,
    badges: [
      {
        id: '1',
        name: 'Super Donateur',
        description: 'A fait plus de 10 dons',
        imageUrl: '/badges/super-donor.png',
        criteria: '10+ donations'
      }
    ]
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@healthsolidarity.com',
    role: 'user',
    avatarUrl: 'https://source.unsplash.com/random/300x300/?face',
    createdAt: '2023-02-20T10:15:00.000Z',
    donationsCount: 5,
    totalDonated: 750,
    badges: []
  },
];

// Mock Campaigns
export const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Équipement d\'urgence pour l\'hôpital Saint-Michel',
    description: 'Aide à financer des équipements médicaux essentiels pour le service des urgences de l\'hôpital Saint-Michel qui souffre d\'un manque important de matériel.',
    category: 'equipment',
    location: 'Paris, France',
    organizer: 'Fondation Hôpital Saint-Michel',
    target: 50000,
    raised: 37500,
    donorsCount: 725,
    imageUrl: '/1.jpg',
    endDate: '2023-07-30T00:00:00.000Z',
    createdAt: '2023-01-15T09:00:00.000Z',
    status: 'active',
    updates: [
      {
        id: '101',
        campaignId: '1',
        content: 'Nous avons pu acquérir les premiers respirateurs grâce à vos dons !',
        imageUrl: 'https://source.unsplash.com/random/800x600/?medical',
        createdAt: '2023-03-10T14:30:00.000Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Recherche sur le traitement du cancer pédiatrique',
    description: 'Soutien à une étude innovante sur de nouveaux traitements pour les cancers pédiatriques rares qui manquent cruellement de financement.',
    category: 'research',
    location: 'Lyon, France',
    organizer: 'Institut de Recherche Médicale',
    target: 120000,
    raised: 68000,
    donorsCount: 1240,
    imageUrl: '/2.jpg',
    endDate: '2023-12-15T00:00:00.000Z',
    createdAt: '2023-01-20T11:45:00.000Z',
    status: 'active',
    updates: []
  },
  {
    id: '3',
    title: 'Soins d\'urgence pour les victimes de l\'accident ferroviaire',
    description: 'Aide immédiate pour financer les soins d\'urgence et la réhabilitation des victimes du récent accident ferroviaire.',
    category: 'emergency',
    location: 'Marseille, France',
    organizer: 'Croix-Rouge Française',
    target: 75000,
    raised: 72000,
    donorsCount: 2150,
    imageUrl: '/3.jpg',
    endDate: '2023-06-10T00:00:00.000Z',
    createdAt: '2023-05-05T08:20:00.000Z',
    status: 'urgent',
    updates: []
  },
  {
    id: '4',
    title: 'Programme de sensibilisation à la santé mentale',
    description: 'Financement d\'un programme éducatif dans les écoles pour sensibiliser les jeunes aux enjeux de la santé mentale.',
    category: 'awareness',
    location: 'Toulouse, France',
    organizer: 'Association pour la Santé Mentale',
    target: 35000,
    raised: 35000,
    donorsCount: 870,
    imageUrl: 'https://source.unsplash.com/random/800x600/?mentalhealth',
    endDate: '2023-04-20T00:00:00.000Z',
    createdAt: '2023-02-10T15:30:00.000Z',
    status: 'completed',
    updates: []
  },
  {
    id: '5',
    title: 'Soins médicaux pour les enfants défavorisés',
    description: 'Aide à fournir des soins médicaux essentiels aux enfants des quartiers défavorisés qui n\'ont pas accès aux services de santé de base.',
    category: 'care',
    location: 'Lille, France',
    organizer: 'Médecins Solidaires',
    target: 45000,
    raised: 28500,
    donorsCount: 560,
    imageUrl: 'https://source.unsplash.com/random/800x600/?children',
    endDate: '2023-08-25T00:00:00.000Z',
    createdAt: '2023-03-15T09:45:00.000Z',
    status: 'active',
    updates: []
  }
];

// Mock Donations
export const donations: Donation[] = [
  {
    id: '1',
    userId: '2',
    campaignId: '1',
    amount: 150,
    message: 'Bon courage à toute l\'équipe médicale !',
    anonymous: false,
    createdAt: '2023-02-15T14:30:00.000Z'
  },
  {
    id: '2',
    userId: '2',
    campaignId: '3',
    amount: 250,
    message: 'Mes pensées vont aux victimes et à leurs familles.',
    anonymous: false,
    createdAt: '2023-05-10T09:15:00.000Z'
  },
  {
    id: '3',
    userId: '1',
    campaignId: '2',
    amount: 500,
    message: 'Pour avancer dans la recherche contre cette terrible maladie.',
    anonymous: false,
    createdAt: '2023-03-05T11:45:00.000Z'
  },
  {
    id: '4',
    userId: '1',
    campaignId: '5',
    amount: 300,
    message: '',
    anonymous: true,
    createdAt: '2023-04-20T16:20:00.000Z'
  }
];

// Mock Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalDonations: donations.length,
  activeCampaigns: campaigns.filter(c => c.status === 'active' || c.status === 'urgent').length,
  totalRaised: donations.reduce((acc, donation) => acc + donation.amount, 0),
  donorsCount: [...new Set(donations.map(d => d.userId))].length,
  completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
  recentDonations: donations.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5)
};

// Mock authentication function
export const mockAuth = (email: string, password: string): User | null => {
  if (email === 'admin@healthsolidarity.com' && password === 'admin123') {
    return users[0];
  }
  if (email === 'user@healthsolidarity.com' && password === 'user123') {
    return users[1];
  }
  return null;
};
