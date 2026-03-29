import '@react-navigation/native-stack';

declare module '@react-navigation/native-stack' {
  export interface NativeStackNavigationOptions {
    hideLogin?: boolean;
    hideBack?: boolean;
  }
}