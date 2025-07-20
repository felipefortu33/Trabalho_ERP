// src/components/clientes/EditClienteModal.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axiosConfig';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';
import CustomButton from '../common/CustomButton';
import AnimatedContainer from '../common/AnimatedContainer';

const EditClienteModal = ({ isVisible, onClose, cliente, onClienteUpdated }) => {
  const [editedCliente, setEditedCliente] = useState({
    id: '',
    nome: '',
    contato: '',
    email: '',
    endereco: '',
    status: 'ativo',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cliente) {
      setEditedCliente({
        ...cliente,
        status: cliente.status || 'ativo'
      });
      setErrors({});
    }
  }, [cliente]);

  const handleInputChange = (field, value) => {
    setEditedCliente((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editedCliente.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!editedCliente.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(editedCliente.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!editedCliente.contato.trim()) {
      newErrors.contato = 'Contato é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateCliente = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.put(`/clientes/${editedCliente.id}`, editedCliente);
      Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
      onClienteUpdated();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      useNativeDriver={true}
      avoidKeyboard={true}
      deviceHeight={Dimensions.get('window').height}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.title}>Editar Cliente</Text>
                <Text style={styles.subtitle}>Atualize as informações do cliente</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView 
            style={styles.form} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.formContent}
          >
            <AnimatedContainer animation="fadeInUp" delay={100}>
              {/* Nome */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Nome Completo <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputContainer, errors.nome && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="Digite o nome completo"
                    style={styles.input}
                    value={editedCliente.nome}
                    onChangeText={(text) => handleInputChange('nome', text)}
                    autoCapitalize="words"
                  />
                </View>
                {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
              </View>
            </AnimatedContainer>

            <AnimatedContainer animation="fadeInUp" delay={200}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="Digite o email"
                    style={styles.input}
                    value={editedCliente.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
            </AnimatedContainer>

            <AnimatedContainer animation="fadeInUp" delay={300}>
              {/* Contato */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Telefone/Contato <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputContainer, errors.contato && styles.inputError]}>
                  <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="Digite o telefone"
                    style={styles.input}
                    value={editedCliente.contato}
                    onChangeText={(text) => handleInputChange('contato', text)}
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.contato && <Text style={styles.errorText}>{errors.contato}</Text>}
              </View>
            </AnimatedContainer>

            <AnimatedContainer animation="fadeInUp" delay={400}>
              {/* Endereço */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Endereço</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="Digite o endereço (opcional)"
                    style={styles.input}
                    value={editedCliente.endereco}
                    onChangeText={(text) => handleInputChange('endereco', text)}
                    multiline
                    numberOfLines={2}
                  />
                </View>
              </View>
            </AnimatedContainer>

            <AnimatedContainer animation="fadeInUp" delay={500}>
              {/* Status */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.statusContainer}>
                  <TouchableOpacity
                    style={[
                      styles.statusOption,
                      editedCliente.status === 'ativo' && styles.statusOptionActive
                    ]}
                    onPress={() => handleInputChange('status', 'ativo')}
                  >
                    <Ionicons 
                      name="checkmark-circle-outline" 
                      size={20} 
                      color={editedCliente.status === 'ativo' ? colors.success : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.statusText,
                      editedCliente.status === 'ativo' && styles.statusTextActive
                    ]}>
                      Ativo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusOption,
                      editedCliente.status === 'inativo' && styles.statusOptionActive
                    ]}
                    onPress={() => handleInputChange('status', 'inativo')}
                  >
                    <Ionicons 
                      name="pause-circle-outline" 
                      size={20} 
                      color={editedCliente.status === 'inativo' ? colors.warning : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.statusText,
                      editedCliente.status === 'inativo' && styles.statusTextActive
                    ]}>
                      Inativo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusOption,
                      editedCliente.status === 'vip' && styles.statusOptionActive
                    ]}
                    onPress={() => handleInputChange('status', 'vip')}
                  >
                    <Ionicons 
                      name="star-outline" 
                      size={20} 
                      color={editedCliente.status === 'vip' ? colors.warning : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.statusText,
                      editedCliente.status === 'vip' && styles.statusTextActive
                    ]}>
                      VIP
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </AnimatedContainer>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <CustomButton
              title="Cancelar"
              onPress={handleClose}
              
              style={styles.cancelButton}
              disabled={loading}
            />
            <CustomButton
              title={loading ? "Salvando..." : "Salvar Alterações"}
              onPress={handleUpdateCliente}
              variant="primary"
              style={styles.saveButton}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditClienteModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-start',
    margin: 0,
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: Platform.OS === 'android' ? 20 : 0,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderBottomLeftRadius: Platform.OS === 'android' ? borderRadius.xl : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? borderRadius.xl : 0,
    flex: 1,
    maxHeight: Dimensions.get('window').height * 0.88,
    minHeight: Dimensions.get('window').height * 0.75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  formContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.error + '05',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  statusOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: Platform.OS === 'android' ? borderRadius.xl : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? borderRadius.xl : 0,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.textSecondary,
    textDecorationColor: colors.primary,
  },
  saveButton: {
    flex: 2,
  },
});
