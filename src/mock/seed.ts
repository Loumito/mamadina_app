/**
 * seed.ts - Données de démonstration (mode sans Firebase)
 *
 * Ces données alimentent l'application en mode démo. Lorsque Firebase sera
 * configuré (google-services.json / GoogleService-Info.plist), il suffira de
 * remplacer le DataContext par les services Firestore existants : la forme des
 * données est identique aux types de src/types.
 */
import {
  User,
  Department,
  Task,
  Vehicle,
  Trip,
  Conversation,
  Message,
  Attendance,
  Report,
} from '../types';
import {ROLE_PERMISSIONS} from '../constants/roles';

const now = new Date();
const hours = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000);
const days = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

// ---------------------------------------------------------------------------
// Départements
// ---------------------------------------------------------------------------
export const seedDepartments: Department[] = [
  {
    id: 'd-ops',
    name: 'Opérations',
    description: 'Gestion des opérations terrain',
    managerId: 'u-mgr1',
    employeeIds: ['u-emp1', 'u-emp2'],
    createdAt: days(-120),
    updatedAt: days(-5),
  },
  {
    id: 'd-log',
    name: 'Logistique',
    description: 'Transport et livraisons',
    managerId: 'u-mgr2',
    employeeIds: ['u-emp3', 'u-drv1', 'u-drv2'],
    createdAt: days(-120),
    updatedAt: days(-5),
  },
];

// ---------------------------------------------------------------------------
// Utilisateurs
// ---------------------------------------------------------------------------
export const seedUsers: User[] = [
  {
    id: 'u-admin',
    email: 'admin@mamadina.com',
    role: 'admin',
    firstName: 'Karim',
    lastName: 'Benali',
    phone: '0600000001',
    isActive: true,
    createdAt: days(-200),
    updatedAt: days(-1),
    permissions: ROLE_PERMISSIONS.admin,
  },
  {
    id: 'u-mgr1',
    email: 'sofia@mamadina.com',
    role: 'manager',
    firstName: 'Sofia',
    lastName: 'Haddad',
    phone: '0600000002',
    departmentId: 'd-ops',
    isActive: true,
    createdAt: days(-180),
    updatedAt: days(-2),
    permissions: ROLE_PERMISSIONS.manager,
  },
  {
    id: 'u-mgr2',
    email: 'youssef@mamadina.com',
    role: 'manager',
    firstName: 'Youssef',
    lastName: 'Amrani',
    phone: '0600000003',
    departmentId: 'd-log',
    isActive: true,
    createdAt: days(-175),
    updatedAt: days(-3),
    permissions: ROLE_PERMISSIONS.manager,
  },
  {
    id: 'u-emp1',
    email: 'leila@mamadina.com',
    role: 'employee',
    firstName: 'Leïla',
    lastName: 'Moreau',
    phone: '0600000004',
    departmentId: 'd-ops',
    isActive: true,
    createdAt: days(-90),
    updatedAt: days(-1),
    permissions: ROLE_PERMISSIONS.employee,
  },
  {
    id: 'u-emp2',
    email: 'omar@mamadina.com',
    role: 'employee',
    firstName: 'Omar',
    lastName: 'Cherif',
    phone: '0600000005',
    departmentId: 'd-ops',
    isActive: true,
    createdAt: days(-80),
    updatedAt: days(-1),
    permissions: ROLE_PERMISSIONS.employee,
  },
  {
    id: 'u-emp3',
    email: 'nadia@mamadina.com',
    role: 'employee',
    firstName: 'Nadia',
    lastName: 'Benkacem',
    phone: '0600000006',
    departmentId: 'd-log',
    isActive: false,
    createdAt: days(-70),
    updatedAt: days(-10),
    permissions: ROLE_PERMISSIONS.employee,
  },
  {
    id: 'u-drv1',
    email: 'hassan@mamadina.com',
    role: 'driver',
    firstName: 'Hassan',
    lastName: 'Tazi',
    phone: '0600000007',
    departmentId: 'd-log',
    isActive: true,
    createdAt: days(-60),
    updatedAt: days(-1),
    permissions: ROLE_PERMISSIONS.driver,
  },
  {
    id: 'u-drv2',
    email: 'rachid@mamadina.com',
    role: 'driver',
    firstName: 'Rachid',
    lastName: 'El Fassi',
    phone: '0600000008',
    departmentId: 'd-log',
    isActive: true,
    createdAt: days(-55),
    updatedAt: days(-1),
    permissions: ROLE_PERMISSIONS.driver,
  },
];

// ---------------------------------------------------------------------------
// Tâches
// ---------------------------------------------------------------------------
export const seedTasks: Task[] = [
  {
    id: 't-1',
    title: 'Inventaire entrepôt Nord',
    description: "Réaliser l'inventaire complet des stocks de l'entrepôt Nord.",
    priority: 'high',
    status: 'in_progress',
    assignedTo: ['u-emp1'],
    assignedBy: 'u-mgr1',
    departmentId: 'd-ops',
    dueDate: days(2),
    startDate: days(-1),
    attachments: [],
    history: [
      {action: 'created', userId: 'u-mgr1', timestamp: days(-1)},
      {action: 'started', userId: 'u-emp1', timestamp: hours(-4)},
    ],
    createdAt: days(-1),
    updatedAt: hours(-4),
  },
  {
    id: 't-2',
    title: 'Rapport mensuel de production',
    description: 'Compiler les chiffres de production du mois et préparer la synthèse.',
    priority: 'medium',
    status: 'not_started',
    assignedTo: ['u-emp2'],
    assignedBy: 'u-mgr1',
    departmentId: 'd-ops',
    dueDate: days(5),
    startDate: now,
    attachments: [],
    history: [{action: 'created', userId: 'u-mgr1', timestamp: days(-2)}],
    createdAt: days(-2),
    updatedAt: days(-2),
  },
  {
    id: 't-3',
    title: 'Maintenance préventive machine A3',
    description: 'Contrôle et entretien planifié de la machine A3.',
    priority: 'urgent',
    status: 'delayed',
    assignedTo: ['u-emp1', 'u-emp2'],
    assignedBy: 'u-admin',
    departmentId: 'd-ops',
    dueDate: days(-1),
    startDate: days(-3),
    attachments: [],
    history: [{action: 'created', userId: 'u-admin', timestamp: days(-3)}],
    createdAt: days(-3),
    updatedAt: days(-1),
  },
  {
    id: 't-4',
    title: 'Préparer commande client #4821',
    description: 'Préparer et emballer la commande pour expédition.',
    priority: 'low',
    status: 'completed',
    assignedTo: ['u-emp3'],
    assignedBy: 'u-mgr2',
    departmentId: 'd-log',
    dueDate: days(-2),
    startDate: days(-4),
    completedAt: days(-2),
    attachments: [],
    history: [
      {action: 'created', userId: 'u-mgr2', timestamp: days(-4)},
      {action: 'completed', userId: 'u-emp3', timestamp: days(-2)},
    ],
    createdAt: days(-4),
    updatedAt: days(-2),
  },
  {
    id: 't-5',
    title: 'Vérification documents de transport',
    description: 'Contrôler la conformité des documents avant départ des véhicules.',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: ['u-emp3'],
    assignedBy: 'u-mgr2',
    departmentId: 'd-log',
    dueDate: days(1),
    startDate: hours(-2),
    attachments: [],
    history: [{action: 'created', userId: 'u-mgr2', timestamp: hours(-6)}],
    createdAt: hours(-6),
    updatedAt: hours(-2),
  },
];

// ---------------------------------------------------------------------------
// Flotte : véhicules + trajets
// ---------------------------------------------------------------------------
export const seedVehicles: Vehicle[] = [
  {
    id: 'v-1',
    licensePlate: '12345-A-7',
    model: 'Master',
    brand: 'Renault',
    year: 2021,
    driverId: 'u-drv1',
    status: 'in_transit',
    currentLocation: {latitude: 33.5731, longitude: -7.5898},
    mileage: 84200,
    lastMaintenance: days(-40),
    nextMaintenance: days(20),
    createdAt: days(-300),
    updatedAt: hours(-1),
  },
  {
    id: 'v-2',
    licensePlate: '67890-B-3',
    model: 'Sprinter',
    brand: 'Mercedes',
    year: 2020,
    driverId: 'u-drv2',
    status: 'available',
    currentLocation: {latitude: 33.589, longitude: -7.6039},
    mileage: 120500,
    lastMaintenance: days(-15),
    nextMaintenance: days(45),
    createdAt: days(-320),
    updatedAt: days(-1),
  },
  {
    id: 'v-3',
    licensePlate: '24680-C-1',
    model: 'Daily',
    brand: 'Iveco',
    year: 2019,
    status: 'maintenance',
    mileage: 156000,
    lastMaintenance: days(-2),
    nextMaintenance: days(2),
    createdAt: days(-400),
    updatedAt: days(-2),
  },
];

export const seedTrips: Trip[] = [
  {
    id: 'tr-1',
    vehicleId: 'v-1',
    driverId: 'u-drv1',
    startLocation: {latitude: 33.5731, longitude: -7.5898},
    plannedRoute: [
      {latitude: 33.5731, longitude: -7.5898},
      {latitude: 33.62, longitude: -7.55},
      {latitude: 33.68, longitude: -7.48},
    ],
    actualRoute: [
      {latitude: 33.5731, longitude: -7.5898},
      {latitude: 33.6, longitude: -7.56},
    ],
    departureTime: hours(-2),
    estimatedArrival: hours(1),
    status: 'in_progress',
    distance: 18.4,
    alerts: [
      {
        type: 'delay',
        message: 'Léger retard dû au trafic',
        timestamp: hours(-1),
        severity: 'low',
      },
    ],
    notes: 'Livraison entrepôt Nord',
    createdAt: hours(-2),
    updatedAt: hours(-1),
  },
  {
    id: 'tr-2',
    vehicleId: 'v-2',
    driverId: 'u-drv2',
    startLocation: {latitude: 33.589, longitude: -7.6039},
    endLocation: {latitude: 33.52, longitude: -7.66},
    actualRoute: [
      {latitude: 33.589, longitude: -7.6039},
      {latitude: 33.55, longitude: -7.63},
      {latitude: 33.52, longitude: -7.66},
    ],
    departureTime: days(-1),
    estimatedArrival: days(-1),
    arrivalTime: days(-1),
    status: 'completed',
    distance: 26.1,
    alerts: [],
    notes: 'Livraison client #4821',
    createdAt: days(-1),
    updatedAt: days(-1),
  },
];

// ---------------------------------------------------------------------------
// Messagerie
// ---------------------------------------------------------------------------
export const seedConversations: Conversation[] = [
  {
    id: 'c-1',
    type: 'private',
    participants: ['u-mgr1', 'u-emp1'],
    lastMessage: "Parfait, je m'en occupe tout de suite.",
    lastMessageAt: hours(-3),
    unreadCount: 0,
    createdAt: days(-10),
    createdBy: 'u-mgr1',
  },
  {
    id: 'c-2',
    type: 'group',
    participants: ['u-admin', 'u-mgr1', 'u-mgr2'],
    name: 'Coordination managers',
    lastMessage: 'Réunion demain à 9h.',
    lastMessageAt: hours(-5),
    unreadCount: 2,
    createdAt: days(-30),
    createdBy: 'u-admin',
  },
  {
    id: 'c-3',
    type: 'private',
    participants: ['u-mgr2', 'u-drv1'],
    lastMessage: 'Le véhicule est prêt pour le départ.',
    lastMessageAt: hours(-1),
    unreadCount: 1,
    createdAt: days(-5),
    createdBy: 'u-mgr2',
  },
];

export const seedMessages: Message[] = [
  {
    id: 'm-1',
    conversationId: 'c-1',
    senderId: 'u-mgr1',
    type: 'text',
    content: "Bonjour Leïla, peux-tu commencer l'inventaire de l'entrepôt Nord ?",
    readBy: ['u-mgr1', 'u-emp1'],
    createdAt: hours(-4),
  },
  {
    id: 'm-2',
    conversationId: 'c-1',
    senderId: 'u-emp1',
    type: 'text',
    content: "Parfait, je m'en occupe tout de suite.",
    readBy: ['u-mgr1', 'u-emp1'],
    createdAt: hours(-3),
  },
  {
    id: 'm-3',
    conversationId: 'c-2',
    senderId: 'u-admin',
    type: 'text',
    content: 'Bonjour à tous, pensez à finaliser les rapports mensuels.',
    readBy: ['u-admin'],
    createdAt: hours(-6),
  },
  {
    id: 'm-4',
    conversationId: 'c-2',
    senderId: 'u-mgr2',
    type: 'text',
    content: 'Réunion demain à 9h.',
    readBy: ['u-mgr2'],
    createdAt: hours(-5),
  },
  {
    id: 'm-5',
    conversationId: 'c-3',
    senderId: 'u-drv1',
    type: 'text',
    content: 'Le véhicule est prêt pour le départ.',
    readBy: ['u-drv1'],
    createdAt: hours(-1),
  },
];

// ---------------------------------------------------------------------------
// Pointage
// ---------------------------------------------------------------------------
const todayAt = (h: number, m: number) => {
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  return d;
};

export const seedAttendance: Attendance[] = [
  {
    id: 'a-1',
    userId: 'u-emp1',
    date: now,
    checkIn: todayAt(8, 5),
    location: {latitude: 33.5731, longitude: -7.5898},
    status: 'present',
    createdAt: todayAt(8, 5),
    updatedAt: todayAt(8, 5),
  },
  {
    id: 'a-2',
    userId: 'u-emp2',
    date: now,
    checkIn: todayAt(9, 20),
    location: {latitude: 33.5731, longitude: -7.5898},
    status: 'late',
    createdAt: todayAt(9, 20),
    updatedAt: todayAt(9, 20),
  },
  {
    id: 'a-3',
    userId: 'u-emp1',
    date: days(-1),
    checkIn: todayAt(8, 0),
    checkOut: todayAt(17, 2),
    location: {latitude: 33.5731, longitude: -7.5898},
    status: 'present',
    createdAt: days(-1),
    updatedAt: days(-1),
  },
];

// ---------------------------------------------------------------------------
// Rapports
// ---------------------------------------------------------------------------
export const seedReports: Report[] = [
  {
    id: 'r-1',
    type: 'monthly',
    format: 'pdf',
    startDate: days(-30),
    endDate: now,
    departmentId: 'd-ops',
    performanceMetrics: {
      tasksCompleted: 42,
      tasksDelayed: 5,
      tasksInProgress: 8,
      attendanceRate: 0.94,
      averageCompletionTime: 2.3,
    },
    createdAt: days(-1),
    createdBy: 'u-mgr1',
  },
  {
    id: 'r-2',
    type: 'weekly',
    format: 'excel',
    startDate: days(-7),
    endDate: now,
    departmentId: 'd-log',
    fleetMetrics: {
      totalTrips: 34,
      completedTrips: 30,
      delayedTrips: 4,
      totalDistance: 1240,
      vehiclesActive: 2,
      vehiclesInMaintenance: 1,
    },
    createdAt: days(-1),
    createdBy: 'u-mgr2',
  },
];
