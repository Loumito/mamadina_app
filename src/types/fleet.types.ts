export type VehicleStatus = 'available' | 'in_transit' | 'maintenance';
export type TripStatus = 'in_progress' | 'completed' | 'delayed';
export type AlertType = 'deviation' | 'delay' | 'speed' | 'maintenance';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  brand: string;
  year: number;
  driverId?: string;
  status: VehicleStatus;
  currentLocation?: Location;
  mileage: number;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripAlert {
  type: AlertType;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  startLocation: Location;
  endLocation?: Location;
  plannedRoute?: Location[];
  actualRoute: Location[];
  departureTime: Date;
  estimatedArrival?: Date;
  arrivalTime?: Date;
  status: TripStatus;
  distance: number;
  alerts: TripAlert[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleDto {
  licensePlate: string;
  model: string;
  brand: string;
  year: number;
  mileage: number;
}

export interface CreateTripDto {
  vehicleId: string;
  driverId: string;
  startLocation: Location;
  plannedRoute?: Location[];
  estimatedArrival?: Date;
  notes?: string;
}

export interface UpdateTripDto {
  endLocation?: Location;
  arrivalTime?: Date;
  status?: TripStatus;
  distance?: number;
  notes?: string;
}
