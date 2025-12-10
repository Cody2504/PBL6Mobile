import { Stack } from 'expo-router';

export default function PostLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="post-screen" 
        options={{ 
          headerShown: false,
          title: 'Posts'
        }} 
      />
      <Stack.Screen 
        name="post-detail" 
        options={{ 
          headerShown: false,
          title: 'Posts Detail'
        }} 
      />
      <Stack.Screen 
        name="files-screen" 
        options={{ 
          headerShown: false,
          title: 'Files'
        }} 
      />
      <Stack.Screen 
        name="other-screen" 
        options={{ 
          headerShown: false,
          title: 'Other'
        }} 
      />
    </Stack>
  );
}