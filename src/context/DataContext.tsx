/**
 * DataContext.tsx - Source de données de l'application (mode démo en mémoire).
 *
 * Tous les écrans lisent et écrivent via ce contexte. Pour brancher Firebase,
 * il suffira de remplacer les implémentations ci-dessous par les appels aux
 * services Firestore existants (src/services) : l'interface exposée par le
 * hook useData() reste identique.
 */
import React, {createContext, useContext, useState, useCallback} from 'react';
import {
  User,
  Department,
  Task,
  TaskStatus,
  CreateTaskDto,
  Vehicle,
  VehicleStatus,
  Trip,
  TripStatus,
  Conversation,
  Message,
  Attendance,
  Report,
} from '../types';
import {
  seedUsers,
  seedDepartments,
  seedTasks,
  seedVehicles,
  seedTrips,
  seedConversations,
  seedMessages,
  seedAttendance,
  seedReports,
} from '../mock/seed';

let counter = 1000;
const newId = (prefix: string) => `${prefix}-${++counter}`;

interface DataContextValue {
  users: User[];
  departments: Department[];
  tasks: Task[];
  vehicles: Vehicle[];
  trips: Trip[];
  conversations: Conversation[];
  messages: Message[];
  attendance: Attendance[];
  reports: Report[];

  // Lookups
  getUserById: (id: string) => User | undefined;
  getDepartmentById: (id: string) => Department | undefined;
  getMessagesForConversation: (conversationId: string) => Message[];
  getConversationsForUser: (userId: string) => Conversation[];
  getAttendanceForUser: (userId: string) => Attendance[];
  getTodayAttendance: (userId: string) => Attendance | undefined;

  // Users
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (id: string, changes: Partial<User>) => void;
  toggleUserActive: (id: string) => void;

  // Tasks
  addTask: (dto: CreateTaskDto, assignedBy: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus, userId: string) => void;
  deleteTask: (id: string) => void;

  // Fleet
  setVehicleStatus: (id: string, status: VehicleStatus) => void;
  setTripStatus: (id: string, status: TripStatus) => void;

  // Messaging
  sendMessage: (conversationId: string, senderId: string, content: string) => void;
  markConversationRead: (conversationId: string) => void;

  // Attendance
  checkIn: (userId: string) => void;
  checkOut: (userId: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [departments] = useState<Department[]>(seedDepartments);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [vehicles, setVehicles] = useState<Vehicle[]>(seedVehicles);
  const [trips, setTrips] = useState<Trip[]>(seedTrips);
  const [conversations, setConversations] =
    useState<Conversation[]>(seedConversations);
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [attendance, setAttendance] = useState<Attendance[]>(seedAttendance);
  const [reports] = useState<Report[]>(seedReports);

  const getUserById = useCallback(
    (id: string) => users.find(u => u.id === id),
    [users],
  );
  const getDepartmentById = useCallback(
    (id: string) => departments.find(d => d.id === id),
    [departments],
  );
  const getMessagesForConversation = useCallback(
    (conversationId: string) =>
      messages
        .filter(m => m.conversationId === conversationId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    [messages],
  );
  const getConversationsForUser = useCallback(
    (userId: string) =>
      conversations
        .filter(c => c.participants.includes(userId))
        .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime()),
    [conversations],
  );
  const getAttendanceForUser = useCallback(
    (userId: string) =>
      attendance
        .filter(a => a.userId === userId)
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    [attendance],
  );
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const getTodayAttendance = useCallback(
    (userId: string) =>
      attendance.find(
        a => a.userId === userId && isSameDay(a.date, new Date()),
      ),
    [attendance],
  );

  const addUser = useCallback(
    (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
      const date = new Date();
      setUsers(prev => [
        {...user, id: newId('u'), createdAt: date, updatedAt: date},
        ...prev,
      ]);
    },
    [],
  );

  const updateUser = useCallback((id: string, changes: Partial<User>) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? {...u, ...changes, updatedAt: new Date()} : u,
      ),
    );
  }, []);

  const toggleUserActive = useCallback((id: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? {...u, isActive: !u.isActive, updatedAt: new Date()} : u,
      ),
    );
  }, []);

  const addTask = useCallback((dto: CreateTaskDto, assignedBy: string) => {
    const date = new Date();
    const task: Task = {
      id: newId('t'),
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      status: 'not_started',
      assignedTo: dto.assignedTo,
      assignedBy,
      departmentId: dto.departmentId,
      dueDate: dto.dueDate,
      startDate: dto.startDate,
      attachments: [],
      location: dto.location,
      history: [{action: 'created', userId: assignedBy, timestamp: date}],
      createdAt: date,
      updatedAt: date,
    };
    setTasks(prev => [task, ...prev]);
  }, []);

  const updateTaskStatus = useCallback(
    (id: string, status: TaskStatus, userId: string) => {
      const date = new Date();
      setTasks(prev =>
        prev.map(t =>
          t.id === id
            ? {
                ...t,
                status,
                completedAt: status === 'completed' ? date : t.completedAt,
                updatedAt: date,
                history: [
                  ...t.history,
                  {action: `status:${status}`, userId, timestamp: date},
                ],
              }
            : t,
        ),
      );
    },
    [],
  );

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const setVehicleStatus = useCallback(
    (id: string, status: VehicleStatus) => {
      setVehicles(prev =>
        prev.map(v =>
          v.id === id ? {...v, status, updatedAt: new Date()} : v,
        ),
      );
    },
    [],
  );

  const setTripStatus = useCallback((id: string, status: TripStatus) => {
    const date = new Date();
    setTrips(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              status,
              arrivalTime: status === 'completed' ? date : t.arrivalTime,
              updatedAt: date,
            }
          : t,
      ),
    );
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, senderId: string, content: string) => {
      const date = new Date();
      const message: Message = {
        id: newId('m'),
        conversationId,
        senderId,
        type: 'text',
        content,
        readBy: [senderId],
        createdAt: date,
      };
      setMessages(prev => [...prev, message]);
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? {...c, lastMessage: content, lastMessageAt: date, unreadCount: 0}
            : c,
        ),
      );
    },
    [],
  );

  const markConversationRead = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? {...c, unreadCount: 0} : c,
      ),
    );
  }, []);

  const checkIn = useCallback((userId: string) => {
    const date = new Date();
    const status = date.getHours() >= 9 ? 'late' : 'present';
    setAttendance(prev => {
      const existing = prev.find(
        a => a.userId === userId && isSameDay(a.date, date),
      );
      if (existing) {
        return prev.map(a =>
          a.id === existing.id ? {...a, checkIn: date, status} : a,
        );
      }
      return [
        {
          id: newId('a'),
          userId,
          date,
          checkIn: date,
          location: {latitude: 33.5731, longitude: -7.5898},
          status,
          createdAt: date,
          updatedAt: date,
        },
        ...prev,
      ];
    });
  }, []);

  const checkOut = useCallback((userId: string) => {
    const date = new Date();
    setAttendance(prev =>
      prev.map(a =>
        a.userId === userId && isSameDay(a.date, date)
          ? {...a, checkOut: date, updatedAt: date}
          : a,
      ),
    );
  }, []);

  const value: DataContextValue = {
    users,
    departments,
    tasks,
    vehicles,
    trips,
    conversations,
    messages,
    attendance,
    reports,
    getUserById,
    getDepartmentById,
    getMessagesForConversation,
    getConversationsForUser,
    getAttendanceForUser,
    getTodayAttendance,
    addUser,
    updateUser,
    toggleUserActive,
    addTask,
    updateTaskStatus,
    deleteTask,
    setVehicleStatus,
    setTripStatus,
    sendMessage,
    markConversationRead,
    checkIn,
    checkOut,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextValue => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData doit être utilisé dans un DataProvider');
  }
  return ctx;
};
