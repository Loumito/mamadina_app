import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Input, Button} from '../common';
import {COLORS} from '../../constants';
import {User, UserRole, Department} from '../../types';
import {ROLE_PERMISSIONS} from '../../constants/roles';
import {roleLabel, roleColor} from '../../utils/labels';
import {isValidEmail, isValidPhone} from '../../utils/validators';

interface UserFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  departments: Department[];
}

const ROLES: UserRole[] = ['admin', 'manager', 'employee', 'driver'];

export const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  departments,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [departmentId, setDepartmentId] = useState<string | undefined>();
  const [error, setError] = useState('');

  const reset = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRole('employee');
    setDepartmentId(undefined);
    setError('');
  };

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Le prénom et le nom sont requis.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Email invalide.');
      return;
    }
    if (!isValidPhone(phone)) {
      setError('Numéro de téléphone invalide (10 chiffres).');
      return;
    }
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role,
      departmentId,
      isActive: true,
      permissions: ROLE_PERMISSIONS[role],
    });
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.heading}>Nouvel utilisateur</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Input label="Prénom" value={firstName} onChangeText={setFirstName} />
            <Input label="Nom" value={lastName} onChangeText={setLastName} />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Téléphone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Rôle</Text>
            <View style={styles.chipRow}>
              {ROLES.map(r => {
                const selected = r === role;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRole(r)}
                    style={[
                      styles.chip,
                      selected && {
                        backgroundColor: roleColor[r] + '22',
                        borderColor: roleColor[r],
                      },
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        selected && {color: roleColor[r], fontWeight: '700'},
                      ]}>
                      {roleLabel[r]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Département</Text>
            <View style={styles.chipRow}>
              {departments.map(d => {
                const selected = d.id === departmentId;
                return (
                  <TouchableOpacity
                    key={d.id}
                    onPress={() => setDepartmentId(selected ? undefined : d.id)}
                    style={[styles.chip, selected && styles.chipSelected]}>
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}>
                      {d.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.actions}>
            <Button
              title="Annuler"
              variant="outline"
              onPress={() => {
                reset();
                onClose();
              }}
              style={styles.actionButton}
            />
            <Button title="Créer" onPress={handleSubmit} style={styles.actionButton} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.divider,
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  error: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
