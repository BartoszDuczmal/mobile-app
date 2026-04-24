import { Text, TextInput, TextInputProps, TextProps } from 'react-native';

interface MyTextProps extends TextProps {
  className?: string;
}

interface MyTextInputProps extends TextInputProps {
    className?: string;
}

export const StyledText = ({ className, style, ...props }: MyTextProps) => (
  <Text className={`font-main ${className ?? ""}`} style={style} {...props} />
);

export const StyledTextInput = ({ className, style, ...props }: MyTextInputProps) => (
  <TextInput className={`font-main ${className ?? ""}`} style={style} {...props} />
);