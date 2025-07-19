import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/common/CustomButton';
import CustomTextInput from '../components/common/CustomTextInput';
import { colors, spacing, borderRadius, shadows } from '../utils/colors';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const { width, height } = Dimensions.get('window');
  const isTablet = width > 768;

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin && !formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo quando usuário digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', {
          email: formData.email,
          senha: formData.senha,
        });
        await AsyncStorage.setItem('token', res.data.token);
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.replace('Main');
      } else {
        await api.post('/auth/register', formData);
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        setIsLogin(true);
        setFormData({ nome: '', email: '', senha: '' });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Erro ao ${isLogin ? 'logar' : 'cadastrar'}`;
      Alert.alert('Erro', errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ nome: '', email: '', senha: '' });
    setErrors({});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={[styles.headerSection, isTablet && styles.headerTablet]}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>ERP</Text>
              <Text style={styles.logoSubtext}>Sistema de Gestão</Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={[styles.formContainer, isTablet && styles.formTablet]}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
              </Text>
              <Text style={styles.formSubtitle}>
                {isLogin 
                  ? 'Faça login para continuar' 
                  : 'Preencha os dados para começar'
                }
              </Text>
            </View>

            <View style={styles.formBody}>
              {!isLogin && (
                <CustomTextInput
                  label="Nome completo"
                  value={formData.nome}
                  onChangeText={(text) => handleChange('nome', text)}
                  leftIcon="person-outline"
                  error={errors.nome}
                  autoCapitalize="words"
                />
              )}

              <CustomTextInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                leftIcon="mail-outline"
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomTextInput
                label="Senha"
                value={formData.senha}
                onChangeText={(text) => handleChange('senha', text)}
                leftIcon="lock-closed-outline"
                error={errors.senha}
                secureTextEntry
              />

              <CustomButton
                title={isLogin ? 'Entrar' : 'Cadastrar'}
                onPress={handleSubmit}
                loading={loading}
                size="large"
                style={styles.submitButton}
              />

              <CustomButton
                title={isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
                onPress={toggleAuthMode}
                variant="ghost"
                size="medium"
                style={styles.toggleButton}
                textStyle={styles.toggleText}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
    backgroundColor: colors.primary,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginHorizontal: -spacing.lg,
    marginTop: -spacing.xl,
  },
  headerTablet: {
    marginBottom: spacing.xxxl * 1.5,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textWhite,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  logoSubtext: {
    fontSize: 16,
    color: colors.textWhite,
    opacity: 0.8,
    fontWeight: '300',
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  formTablet: {
    maxWidth: 500,
    padding: spacing.xxxl,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formBody: {
    width: '100%',
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  toggleButton: {
    marginTop: spacing.sm,
  },
  toggleText: {
    color: colors.primary,
    fontSize: 14,
  },
});
