import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Alert,
  RefreshControl,
  StatusBar,
  Dimensions
} from 'react-native';
import ProdutoCard from '../components/produtos/ProdutoCard';
import AddProdutoModal from '../components/produtos/AddProdutoModal';
import EditProdutoModal from '../components/produtos/EditProdutoModal';
import DeleteProdutoModal from '../components/produtos/DeleteProdutoModal';
import SearchBar from '../components/produtos/SearchBar';
import CustomButton from '../components/common/CustomButton';
import AnimatedContainer from '../components/common/AnimatedContainer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../api/axiosConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';

const ProdutosScreen = () => {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const fetchProdutos = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
      setFilteredProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProdutos(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredProdutos(produtos);
    } else {
      const filtered = produtos.filter(produto => 
        produto.nome.toLowerCase().includes(term.toLowerCase()) ||
        produto.descricao?.toLowerCase().includes(term.toLowerCase()) ||
        produto.categoria?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProdutos(filtered);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProdutos();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={40} color={colors.primary} />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header */}
      <AnimatedContainer animation="fadeInUp" style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Gestão de Produtos</Text>
          <Text style={styles.subtitle}>
            {filteredProdutos.length} produto{filteredProdutos.length !== 1 ? 's' : ''} encontrado{filteredProdutos.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.statsCard}>
          <Ionicons name="cube-outline" size={24} color={colors.primary} />
          <Text style={styles.statsNumber}>{produtos.length}</Text>
        </View>
      </AnimatedContainer>

      {/* Search and Add Button */}
      <AnimatedContainer animation="fadeInUp" delay={200} style={styles.actionSection}>
        <SearchBar
          value={searchTerm}
          onChangeText={handleSearch}
          onSearch={() => {}}
          placeholder="Pesquisar por nome, descrição ou categoria"
          style={styles.searchBox}
        />
        
        <CustomButton
          title="Novo Produto"
          onPress={() => setIsAddVisible(true)}
          variant="primary"
          size="medium"
          style={styles.addButton}
        />
      </AnimatedContainer>

      {/* Products List */}
      <AnimatedContainer animation="fadeInUp" delay={400} style={styles.listContainer}>
        {filteredProdutos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchTerm 
                ? 'Tente pesquisar com outros termos' 
                : 'Comece adicionando seu primeiro produto'
              }
            </Text>
            {!searchTerm && (
              <CustomButton
                title="Adicionar Primeiro Produto"
                onPress={() => setIsAddVisible(true)}
                variant="outline"
                style={styles.emptyButton}
              />
            )}
          </View>
        ) : (
          <FlatList
            data={filteredProdutos}
            keyExtractor={(item) => item.id.toString()}
            numColumns={isTablet ? 3 : 2}
            key={isTablet ? 'tablet' : 'phone'}
            renderItem={({ item, index }) => (
              <AnimatedContainer
                animation="fadeInUp"
                delay={index * 100}
                style={[styles.produtoContainer, { width: isTablet ? '32%' : '48%' }]}
              >
                <ProdutoCard
                  produto={item}
                  onEdit={() => setProdutoEditando(item)}
                  onDelete={() => setProdutoParaExcluir(item)}
                />
              </AnimatedContainer>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={isTablet ? styles.row : styles.row}
          />
        )}
      </AnimatedContainer>

      {/* Modals */}
      <AddProdutoModal visible={isAddVisible} onClose={() => setIsAddVisible(false)} onRefresh={fetchProdutos} />
      <EditProdutoModal produto={produtoEditando} onClose={() => setProdutoEditando(null)} onRefresh={fetchProdutos} />
      <DeleteProdutoModal produto={produtoParaExcluir} onClose={() => setProdutoParaExcluir(null)} onConfirm={fetchProdutos} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  statsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    alignItems: 'flex-end',
  },
  searchBox: {
    flex: 1,
  },
  addButton: {
    minWidth: 120,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  flatListContent: {
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  produtoContainer: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
});

export default ProdutosScreen;
