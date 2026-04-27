import {firebaseFirestore, COLLECTIONS} from '../api/firebase';
import {Location} from '../types/fleet.types';
import {CheckInDto, CheckOutDto} from '../types/attendance.types';

export class GPSService {
  async updateVehicleLocation(
    vehicleId: string,
    location: Location,
  ): Promise<void> {
    try {
      await firebaseFirestore.collection(COLLECTIONS.VEHICLES).doc(vehicleId).update({
        currentLocation: new firebaseFirestore.GeoPoint(
          location.latitude,
          location.longitude,
        ),
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Update vehicle location error:', error);
      throw new Error(error.message || 'Failed to update vehicle location');
    }
  }

  async addTripLocation(tripId: string, location: Location): Promise<void> {
    try {
      await firebaseFirestore
        .collection(COLLECTIONS.TRIPS)
        .doc(tripId)
        .update({
          actualRoute: firebaseFirestore.FieldValue.arrayUnion(
            new firebaseFirestore.GeoPoint(location.latitude, location.longitude),
          ),
          updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
        });
    } catch (error: any) {
      console.error('Add trip location error:', error);
      throw new Error(error.message || 'Failed to add trip location');
    }
  }

  async checkIn(userId: string, data: CheckInDto): Promise<string> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const docRef = await firebaseFirestore.collection(COLLECTIONS.ATTENDANCE).add({
        userId,
        date: today,
        checkIn: firebaseFirestore.FieldValue.serverTimestamp(),
        location: new firebaseFirestore.GeoPoint(
          data.location.latitude,
          data.location.longitude,
        ),
        status: 'present',
        notes: data.notes || '',
        createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });

      return docRef.id;
    } catch (error: any) {
      console.error('Check in error:', error);
      throw new Error(error.message || 'Failed to check in');
    }
  }

  async checkOut(attendanceId: string, data: CheckOutDto): Promise<void> {
    try {
      await firebaseFirestore
        .collection(COLLECTIONS.ATTENDANCE)
        .doc(attendanceId)
        .update({
          checkOut: firebaseFirestore.FieldValue.serverTimestamp(),
          updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
        });
    } catch (error: any) {
      console.error('Check out error:', error);
      throw new Error(error.message || 'Failed to check out');
    }
  }

  async getTodayAttendance(userId: string): Promise<any | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const snapshot = await firebaseFirestore
        .collection(COLLECTIONS.ATTENDANCE)
        .where('userId', '==', userId)
        .where('date', '==', today)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {id: doc.id, ...doc.data()};
    } catch (error) {
      console.error('Get today attendance error:', error);
      return null;
    }
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    // Haversine formula to calculate distance between two points
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  isWithinGeofence(
    currentLocation: Location,
    targetLocation: Location,
    radiusInMeters: number,
  ): boolean {
    const distance = this.calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      targetLocation.latitude,
      targetLocation.longitude,
    );
    return distance <= radiusInMeters;
  }
}

export const gpsService = new GPSService();
