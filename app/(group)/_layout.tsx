import { Stack } from 'expo-router';

export default function PostLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="team-screen" 
        options={{ 
          headerShown: false,
          title: 'Teams'
        }} 
      />
      <Stack.Screen 
        name="add-members" 
        options={{ 
          headerShown: false,
          title: 'Add Members'
        }} 
      />
      <Stack.Screen 
        name="create-team" 
        options={{ 
          headerShown: false,
          title: 'Teams'
        }} 
      />
      <Stack.Screen 
        name="team-members" 
        options={{ 
          headerShown: false,
          title: 'Teams'
        }} 
      />
      <Stack.Screen 
        name="team-detail" 
        options={{ 
          headerShown: false,
          title: 'Team Detail'
        }} 
      />
    </Stack>
  );
}