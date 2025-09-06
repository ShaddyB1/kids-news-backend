import { NavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Stories: undefined;
  Quiz: undefined;
  Archive: undefined;
  Parents: undefined;
  Account: undefined;
};

export type ScreenNavigationProp = NavigationProp<RootStackParamList>;
export type ScreenRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
