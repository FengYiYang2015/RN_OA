/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import LoginScreen from './src/pages/Login'
import HomeScreen from './src/pages/Home'
import MineScreen from './src/pages/MinePage'
import AwaitScreen from './src/pages/Await'
import TabBarItem from './src/components/TabBarItem'
import StaffBorrowingScreen from './src/pages/finance/StaffBorrowing'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom
} from 'react-navigation'

export default class App extends Component {
  render() {
    return (
      <RootStack />
    )
  }
}

const TabRouteConfigs = {
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: '首页',
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarItem
          tintColor={tintColor}
          focused={focused}
          normalImage={require('./src/assets/home_nomar3x.png')}
          selectedImage={require('./src/assets/home_selected3x.png')}
        />
      ),
    }),
  },
  Mine: {
    screen: MineScreen,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarItem
          tintColor={tintColor}
          focused={focused}
          normalImage={require('./src/assets/my_nomar3x.png')}
          selectedImage={require('./src/assets/my_selected3x.png')}
        />
      )
    }
  }
}

const TabNavigatorConfigs = {
  initialRouteName: 'Home',
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  lazy: true,
}

const Tab = TabNavigator(TabRouteConfigs, TabNavigatorConfigs)

const StackRouteConfigs = {
  Login: {
    screen: LoginScreen
  },
  Tab: {
    screen: Tab,
  },
  Await: {
    screen: AwaitScreen
  },
  StaffBorrowing: {
    screen: StaffBorrowingScreen
  }
}

const StackNavigatorConfigs = {
  initialRouteName: 'Login',
  navigationOptions: {
    headerTitle: '返回',
    headerStyle: {backgroundColor: '#2196F3'},
    headerTitleStyle: {color: '#fff'},
    headerTintColor: '#fff',
  },
  mode: 'card',
  headerMode: 'screen',
}

const RootStack = StackNavigator(StackRouteConfigs, StackNavigatorConfigs)
