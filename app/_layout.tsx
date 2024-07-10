import React from 'react';
import { AuthProvider } from './AuthProvider';
import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login/index" options={{ headerShown: false }} />
                <Stack.Screen name="register/index" options={{ headerShown: false }} />
                <Stack.Screen name="todos/index" options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}