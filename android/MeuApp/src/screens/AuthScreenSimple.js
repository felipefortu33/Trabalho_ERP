// src/screens/AuthScreenSimple.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity,
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

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
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
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.logoText}>ERP</Text>
          <Text style={styles.logoSubtext}>Sistema de Gestão</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
          </Text>

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={formData.nome}
              onChangeText={(text) => handleChange('nome', text)}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={formData.senha}
            onChangeText={(text) => handleChange('senha', text)}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 48,
    backgroundColor: '#000000',
    padding: 32,
    borderRadius: 24,
    marginHorizontal: -24,
    marginTop: -32,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },
  logoSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '300',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#6B7280',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  toggleButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  toggleText: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default AuthScreen;
