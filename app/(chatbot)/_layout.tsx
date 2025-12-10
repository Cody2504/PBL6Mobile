import { Stack } from 'expo-router';

export default function ChatbotLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="conversation"
        options={{
          title: "AI Assistant",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
