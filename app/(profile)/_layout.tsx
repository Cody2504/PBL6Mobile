import { Stack } from 'expo-router'

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="edit-profile"
        options={{
          headerShown: false,
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          headerShown: false,
          title: 'Change Password',
        }}
      />
    </Stack>
  )
}
