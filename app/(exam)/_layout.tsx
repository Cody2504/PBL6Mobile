import { Stack } from 'expo-router'

export default function ExamLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen
        name="list"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="taking"
        options={{
          presentation: 'card',
          gestureEnabled: false, // Prevent swipe back during exam
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          presentation: 'modal',
          gestureEnabled: false, // Prevent dismissal
        }}
      />
    </Stack>
  )
}
