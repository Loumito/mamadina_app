export type AttendanceStatus = 'present' | 'absent' | 'late' | 'on_leave';

export interface Attendance {
  id: string;
  userId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  status: AttendanceStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckInDto {
  location: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

export interface CheckOutDto {
  location: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}
