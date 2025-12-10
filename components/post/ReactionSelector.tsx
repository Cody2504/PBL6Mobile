// src/components/ReactionSelector.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ReactionEmoji } from '../../types/post';

interface ReactionSelectorProps {
  onSelectReaction: (reactionType: ReactionEmoji['type']) => void;
}

// Data for the horizontal emojis
const REACTIONS: ReactionEmoji[] = [
  { type: 'Like', emoji: '👍' },
  { type: 'Heart', emoji: '❤️' },
  { type: 'Haha', emoji: '😂' },
  { type: 'Sad', emoji: '😢' },
];

const ReactionSelector: React.FC<ReactionSelectorProps> = ({ onSelectReaction }) => {
  return (
    <View style={styles.container}>
      {REACTIONS.map((reaction) => (
        <TouchableOpacity
          key={reaction.type}
          style={styles.reactionButton}
          onPress={() => onSelectReaction(reaction.type)}
        >
          <Text style={styles.emoji}>{reaction.emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 3,
    // Basic shadow for that floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    position: 'absolute', // Position relative to where the button is
    bottom: 40, // Adjust this based on your layout
    zIndex: 10,
  },
  reactionButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  emoji: {
    fontSize: 24,
  },
});

export default ReactionSelector;