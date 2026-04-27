import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Formik} from 'formik';
import {Button, Input} from '../../components/common';
import {authService} from '../../services';
import {setUser, setLoading, setError} from '../../store/slices/authSlice';
import {loginSchema} from '../../utils/validators';
import {COLORS} from '../../constants';
import {useTranslation} from 'react-i18next';

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values: {email: string; password: string}) => {
    try {
      dispatch(setLoading(true));
      const user = await authService.signIn(values.email, values.password);
      dispatch(setUser(user));
      // Navigation will be handled by the navigator based on auth state
    } catch (error: any) {
      dispatch(setError(error.message));
      Alert.alert(t('common.error'), error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>{t('common.appName')}</Text>
            <Text style={styles.subtitle}>
              {t('auth.login')}
            </Text>
          </View>

          <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={loginSchema}
            onSubmit={handleLogin}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View style={styles.form}>
                <Input
                  label={t('auth.email')}
                  placeholder={t('auth.email')}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email ? errors.email : undefined}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />

                <Input
                  label={t('auth.password')}
                  placeholder={t('auth.password')}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password ? errors.password : undefined}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => {
                    // Navigate to forgot password screen
                  }}>
                  <Text style={styles.forgotPasswordText}>
                    {t('auth.forgotPassword')}
                  </Text>
                </TouchableOpacity>

                <Button
                  title={t('auth.signIn')}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  style={styles.loginButton}
                />
              </View>
            )}
          </Formik>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
  },
});
