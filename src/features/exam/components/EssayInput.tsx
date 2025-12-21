import React, { useState } from 'react'
import { View, TextInput, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { createStyles } from './EssayInput.styles'

interface EssayInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
}

export default function EssayInput({
  value,
  onChangeText,
  placeholder = 'Nhập câu trả lời của bạn...',
  disabled = false,
  maxLength = 5000,
}: EssayInputProps) {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={styles.container}>
      {/* Label */}
      <View style={styles.labelContainer}>
        <Ionicons name="create-outline" size={18} color={styles.labelIcon.color} />
        <Text style={styles.label}>Câu trả lời tự luận</Text>
      </View>

      {/* Text input */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainer_focused,
          disabled && styles.inputContainer_disabled,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={styles.placeholder.color}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
        />
      </View>

      {/* Character counter */}
      <View style={styles.footer}>
        <View style={styles.characterCount}>
          <Text
            style={[
              styles.characterCountText,
              value.length >= maxLength && styles.characterCountText_limit,
            ]}
          >
            {value.length}/{maxLength}
          </Text>
        </View>

        {/* Helper text */}
        {value.length === 0 && !isFocused && (
          <View style={styles.helperContainer}>
            <Ionicons name="information-circle-outline" size={14} color={styles.helperIcon.color} />
            <Text style={styles.helperText}>Nhập câu trả lời chi tiết của bạn</Text>
          </View>
        )}
      </View>
    </View>
  )
}
