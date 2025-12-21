import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from '@/global/hooks/use-color-scheme'
import { QuestionOption } from '../types'
import { createStyles } from './AnswerOption.styles'

interface AnswerOptionProps {
  option: QuestionOption
  isSelected: boolean
  isMultipleAnswer: boolean
  onSelect: () => void
  disabled?: boolean
}

export default function AnswerOption({
  option,
  isSelected,
  isMultipleAnswer,
  onSelect,
  disabled = false,
}: AnswerOptionProps) {
  const colorScheme = useColorScheme() ?? 'light'
  const styles = createStyles(colorScheme)

  // Determine icon based on type and state
  const getIcon = () => {
    if (isMultipleAnswer) {
      return isSelected ? 'checkbox' : 'square-outline'
    }
    return isSelected ? 'radio-button-on' : 'radio-button-off'
  }

  return (
    <TouchableOpacity
      style={[
        styles.option,
        isSelected && styles.option_selected,
        disabled && styles.option_disabled,
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {/* Selection indicator */}
      <View style={styles.iconContainer}>
        <Ionicons
          name={getIcon()}
          size={24}
          color={
            isSelected
              ? styles.icon_selected.color
              : disabled
                ? styles.icon_disabled.color
                : styles.icon.color
          }
        />
      </View>

      {/* Option content */}
      <View style={styles.content}>
        <View style={styles.optionIdContainer}>
          <Text
            style={[
              styles.optionId,
              isSelected && styles.optionId_selected,
              disabled && styles.optionId_disabled,
            ]}
          >
            {option.id.toUpperCase()}.
          </Text>
        </View>
        <Text
          style={[
            styles.optionText,
            isSelected && styles.optionText_selected,
            disabled && styles.optionText_disabled,
          ]}
        >
          {option.text}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
