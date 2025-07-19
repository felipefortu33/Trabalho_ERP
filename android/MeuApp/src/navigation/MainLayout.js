import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/Sidebar';
import DashboardScreen from '../screens/DashboardScreen';
import ClientesScreen from '../screens/ClientesScreen';
import ProdutosScreen from '../screens/ProdutosScreen';
import PedidosScreen from '../screens/PedidosScreen';
import FinanceiroScreen from '../screens/FinanceiroScreen';
import { colors, spacing } from '../utils/colors';

const Drawer = createDrawerNavigator();

const MainLayout = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <Drawer.Navigator
        drawerContent={(props) => <Sidebar {...props} />}
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.surface,
            elevation: 2,
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          },
          headerTitleStyle: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
          },
          headerLeft: () => (
            <TouchableOpacity 
              style={{ 
                marginLeft: spacing.md,
                padding: spacing.sm,
                borderRadius: 8,
                backgroundColor: colors.background,
              }} 
              onPress={() => navigation.toggleDrawer()}
            >
              <Ionicons name="menu" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          drawerStyle: {
            backgroundColor: colors.surface,
            width: 280,
          },
        })}
      >
        <Drawer.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            title: 'Painel Principal',
          }}
        />
        <Drawer.Screen 
          name="Clientes" 
          component={ClientesScreen}
          options={{
            title: 'Gerenciar Clientes',
          }}
        />
        <Drawer.Screen 
          name="Produtos" 
          component={ProdutosScreen}
          options={{
            title: 'Gerenciar Produtos',
          }}
        />
        <Drawer.Screen 
          name="Pedidos" 
          component={PedidosScreen}
          options={{
            title: 'Gerenciar Pedidos',
          }}
        />
        <Drawer.Screen 
          name="Financeiro" 
          component={FinanceiroScreen}
          options={{
            title: 'Controle Financeiro',
          }}
        />
      </Drawer.Navigator>
    </>
  );
};

export default MainLayout;
