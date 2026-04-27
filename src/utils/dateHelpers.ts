import {format, formatDistanceToNow, parseISO, isToday, isYesterday} from 'date-fns';
import {fr, ar} from 'date-fns/locale';

export const formatDate = (
  date: Date | string,
  formatStr: string = 'dd/MM/yyyy',
  locale: 'fr' | 'ar' = 'fr',
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, {locale: locale === 'ar' ? ar : fr});
};

export const formatDateTime = (
  date: Date | string,
  locale: 'fr' | 'ar' = 'fr',
): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm', locale);
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm');
};

export const formatRelativeTime = (
  date: Date | string,
  locale: 'fr' | 'ar' = 'fr',
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: locale === 'ar' ? ar : fr,
  });
};

export const formatMessageTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return formatTime(dateObj);
  } else if (isYesterday(dateObj)) {
    return 'Hier';
  } else {
    return formatDate(dateObj, 'dd/MM/yyyy');
  }
};

export const isOverdue = (dueDate: Date | string): boolean => {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return dateObj < new Date();
};

export const getDaysUntilDue = (dueDate: Date | string): number => {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const now = new Date();
  const diffTime = dateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const getMonthStart = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getMonthEnd = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};
