import React from 'react';
import { AuthProvider } from './AuthProvider';
import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#43CFC6' }}>
                    <Stack>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="login/index" options={{ headerShown: false }} />
                        <Stack.Screen name="register/index" options={{ headerShown: false }} />
                        <Stack.Screen name="todos/index" options={{ headerShown: false }} />
                    </Stack>
                </SafeAreaView>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
