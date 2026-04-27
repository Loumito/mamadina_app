import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Vehicle, Trip, VehicleStatus, TripStatus} from '../../types';

interface FleetState {
  vehicles: Vehicle[];
  trips: Trip[];
  selectedVehicle: Vehicle | null;
  selectedTrip: Trip | null;
  activeTrips: Trip[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FleetState = {
  vehicles: [],
  trips: [],
  selectedVehicle: null,
  selectedTrip: null,
  activeTrips: [],
  isLoading: false,
  error: null,
};

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles.push(action.payload);
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.vehicles.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.vehicles[index] = action.payload;
      }
      if (state.selectedVehicle?.id === action.payload.id) {
        state.selectedVehicle = action.payload;
      }
    },
    deleteVehicle: (state, action: PayloadAction<string>) => {
      state.vehicles = state.vehicles.filter(v => v.id !== action.payload);
      if (state.selectedVehicle?.id === action.payload) {
        state.selectedVehicle = null;
      }
    },
    setSelectedVehicle: (state, action: PayloadAction<Vehicle | null>) => {
      state.selectedVehicle = action.payload;
    },
    setTrips: (state, action: PayloadAction<Trip[]>) => {
      state.trips = action.payload;
      state.activeTrips = action.payload.filter(
        t => t.status === 'in_progress',
      );
    },
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.unshift(action.payload);
      if (action.payload.status === 'in_progress') {
        state.activeTrips.unshift(action.payload);
      }
    },
    updateTrip: (state, action: PayloadAction<Trip>) => {
      const index = state.trips.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.trips[index] = action.payload;
      }
      if (state.selectedTrip?.id === action.payload.id) {
        state.selectedTrip = action.payload;
      }
      // Update active trips
      state.activeTrips = state.trips.filter(t => t.status === 'in_progress');
    },
    setSelectedTrip: (state, action: PayloadAction<Trip | null>) => {
      state.selectedTrip = action.payload;
    },
    updateVehicleStatus: (
      state,
      action: PayloadAction<{vehicleId: string; status: VehicleStatus}>,
    ) => {
      const vehicle = state.vehicles.find(
        v => v.id === action.payload.vehicleId,
      );
      if (vehicle) {
        vehicle.status = action.payload.status;
      }
    },
    updateTripStatus: (
      state,
      action: PayloadAction<{tripId: string; status: TripStatus}>,
    ) => {
      const trip = state.trips.find(t => t.id === action.payload.tripId);
      if (trip) {
        trip.status = action.payload.status;
        if (action.payload.status === 'completed') {
          trip.arrivalTime = new Date();
        }
      }
      // Update active trips
      state.activeTrips = state.trips.filter(t => t.status === 'in_progress');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  setSelectedVehicle,
  setTrips,
  addTrip,
  updateTrip,
  setSelectedTrip,
  updateVehicleStatus,
  updateTripStatus,
  setLoading,
  setError,
} = fleetSlice.actions;

export default fleetSlice.reducer;

// Selectors
export const selectVehicles = (state: {fleet: FleetState}) =>
  state.fleet.vehicles;
export const selectSelectedVehicle = (state: {fleet: FleetState}) =>
  state.fleet.selectedVehicle;
export const selectTrips = (state: {fleet: FleetState}) => state.fleet.trips;
export const selectActiveTrips = (state: {fleet: FleetState}) =>
  state.fleet.activeTrips;
export const selectSelectedTrip = (state: {fleet: FleetState}) =>
  state.fleet.selectedTrip;
export const selectFleetLoading = (state: {fleet: FleetState}) =>
  state.fleet.isLoading;
export const selectFleetError = (state: {fleet: FleetState}) =>
  state.fleet.error;

// Available vehicles selector
export const selectAvailableVehicles = (state: {fleet: FleetState}) =>
  state.fleet.vehicles.filter(v => v.status === 'available');
