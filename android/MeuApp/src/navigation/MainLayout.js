import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DashboardScreen from '../screens/DashboardScreen';
import ClientesScreen from '../screens/ClientesScreen';
import ProdutosScreen from '../screens/ProdutosScreen';
import PedidosScreen from '../screens/PedidosScreen';
import FinanceiroScreen from '../screens/FinanceiroScreen';
import { colors, spacing } from '../utils/colors';

const Drawer = createDrawerNavigator();

const MainLayout = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        header: () => <Topbar navigation={navigation} />,
        drawerStyle: {
          backgroundColor: colors.surface,
          width: 280,
        },
      })}
    >
        <Drawer.Screen 
          name="Dashboard" 
          component={DashboardScreen}
        />
        <Drawer.Screen 
          name="Clientes" 
          component={ClientesScreen}
        />
        <Drawer.Screen 
          name="Produtos" 
          component={ProdutosScreen}
        />
        <Drawer.Screen 
          name="Pedidos" 
          component={PedidosScreen}
        />
        <Drawer.Screen 
          name="Financeiro" 
          component={FinanceiroScreen}
        />
      </Drawer.Navigator>
  );
};

export default MainLayout;
