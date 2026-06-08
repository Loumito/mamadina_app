import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Button, Input} from '../../components/common';
import {setUser, setError} from '../../store/slices/authSlice';
import {COLORS} from '../../constants';
import {useData} from '../../context/DataContext';
import {UserRole} from '../../types';
import {roleLabel, roleColor} from '../../utils/labels';

const QUICK_ROLES: UserRole[] = ['admin', 'manager', 'employee', 'driver'];

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {users} = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const loginWithUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      dispatch(setUser(user));
    }
  };

  const handleLogin = () => {
    const match = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!match) {
      setFormError('Aucun compte trouvé pour cet email.');
      dispatch(setError('Identifiants invalides'));
      return;
    }
    if (password.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!match.isActive) {
      setFormError('Ce compte est désactivé.');
      return;
    }
    setFormError('');
    dispatch(setUser(match));
  };

  const quickLogin = (role: UserRole) => {
    const user = users.find(u => u.role === role && u.isActive);
    if (user) {
      loginWithUser(user.id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <Text style={styles.title}>Mamadina</Text>
            <Text style={styles.subtitle}>Gestion d'entreprise</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="exemple@mamadina.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="Mot de passe"
              placeholder="••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {formError ? <Text style={styles.error}>{formError}</Text> : null}
            <Button
              title="Se connecter"
              onPress={handleLogin}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Accès démo rapide</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.quickRow}>
            {QUICK_ROLES.map(role => (
              <TouchableOpacity
                key={role}
                style={[styles.quickCard, {borderColor: roleColor[role]}]}
                onPress={() => quickLogin(role)}
                activeOpacity={0.8}>
                <Text style={styles.quickIcon}>
                  {role === 'admin'
                    ? '🛡️'
                    : role === 'manager'
                    ? '📈'
                    : role === 'employee'
                    ? '🧑‍💼'
                    : '🚚'}
                </Text>
                <Text style={[styles.quickLabel, {color: roleColor[role]}]}>
                  {roleLabel[role]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>
            Mot de passe pour tout compte démo : 6 caractères minimum.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {flex: 1},
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFF',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  error: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: 12,
  },
  loginButton: {
    width: '100%',
    marginTop: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.divider,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
