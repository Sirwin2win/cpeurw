import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { token, isLoaded } = useSelector(state => state.auth);

  useEffect(() => {
    if (isLoaded && !token) {
      router.replace('/login');
    }
  }, [isLoaded, token]);

  // Still loading token from AsyncStorage
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Token missing → redirecting
  if (!token) {
    return null;
  }

  return children;
}
