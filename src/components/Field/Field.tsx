import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, StyleProp, TextStyle, ViewStyle, KeyboardTypeOptions, Platform, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EmailIcon from 'react-native-vector-icons/MaterialIcons';
import Font from '../../assests/fonts/Font';
import colors from '../../assests/Colors/Colors';

interface FieldProps {
     type?: 'text' | 'password' | 'email' | 'number' | 'phone' | undefined;
     disabled?: boolean;
     placeHolder?: string;
     value?: string | number | null;
     onChange?: (text: string) => void;
     isIcon?: ReactNode;
     maxLength?: number;
     placeHolderTextColor?: string;
     customClass?: StyleProp<TextStyle>;
     customDivClass?: StyleProp<ViewStyle>;
     inputWidth?: number | string;
     divWidth?: number | string;
     multiline?: boolean;
     iconColor?: string;
     textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
     onFocus?: () => void;
     onBlur?: () => void;
     height?: TextStyle['height'];
     // Props for validation
     required?: boolean;
     validator?: (value: string) => boolean | string; // return true if valid, false or string(error) if invalid
     validateOn?: 'blur' | 'change' | 'submit';
     showError?: boolean;
     errorStyle?: StyleProp<TextStyle>;
     onValidationChange?: (isValid: boolean) => void;
}

const Field: React.FC<FieldProps> = props => {
     const {
          type = 'text',
          disabled = false,
          placeHolder = '',
          value,
          onChange,
          isIcon,
          maxLength,
          placeHolderTextColor = 'gray',
          customClass,
          customDivClass,
          inputWidth = '100%',
          divWidth = 'auto',
          multiline = false,
          textAlignVertical = 'auto',
          onFocus = () => {},
          onBlur = () => {},
          iconColor,
          height,

          // Props for validation
          required = false,
          validator,
          validateOn = 'blur',
          showError = true,
          errorStyle,
          onValidationChange,
     } = props;
     const [isTyping, setIsTyping] = useState<boolean>(false);
     const [isPass, setIsPass] = useState<boolean>(true);
     const [isFocused, setIsFocused] = useState<boolean>(false);
     const [error, setError] = useState<string | null>(null);
     const [onvalidate, setOnvalidate] = useState<'blur' | 'change' | 'submit'>('blur');

     const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

     // Validation Parts Start

     // Regix
     const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     const phoneRe = /^[0-9]{7,15}$/;
     const numberRe = /^\d+$/;

     // Function to validate Default input Values
     const defaultValidate = (val?: string | number | null): string | null => {
          const v = val != null ? String(val).trim() : '';
          if (required && v.length === 0) return 'This field is required.';
          if (v.length === 0) return null;

          switch (type) {
               case 'email':
                    return emailRe.test(v) ? null : 'Invalid email address.';
               case 'phone':
                    return phoneRe.test(v) ? null : 'Invalid phone number.';
               case 'number':
                    return numberRe.test(v) ? null : 'Only numbers allowed.';
               default:
                    return null;
          }
     };

     // central validate function: uses custom validator if provided, else default
     const runValidation = (val?: string | number | null) => {
          if (validator) {
               try {
                    const res = validator(String(val ?? ''));
                    if (res === true) {
                         setError(null);
                         onValidationChange && onValidationChange(true);
                         return true;
                    } else if (res === false) {
                         const msg = 'Invalid value.';
                         setError(msg);
                         onValidationChange && onValidationChange(false);
                         return false;
                    } else {
                         setError(String(res));
                         onValidationChange && onValidationChange(false);
                         return false;
                    }
               } catch (e) {
                    setError('Validation error.');
                    onValidationChange && onValidationChange(false);
                    return false;
               }
          } else {
               const msg = defaultValidate(val);
               setError(msg);
               onValidationChange && onValidationChange(msg === null);
               return msg === null;
          }
     };

     useEffect(() => {
          setOnvalidate(validateOn);
          if (isTyping && validateOn === 'blur') {
               setOnvalidate('change');
          } else {
               setOnvalidate(validateOn);
          }
     }, [isTyping]);

     useEffect(() => {
          if (onvalidate === 'change') {
               runValidation(value);
          }
     }, [value]);

     const dynamicBorderStyle = {
          borderColor: error ? 'red' : isFocused ? colors.PrimaryColor : 'transparent',
          borderWidth: error ? 1.5 : 1,
     };

     // Validation Parts End

     const getInputType = (): KeyboardTypeOptions => {
          switch (type) {
               case 'password':
                    return 'default';
               case 'email':
                    return 'email-address';
               case 'number':
                    return 'numeric';
               case 'phone':
                    return 'numeric';
               default:
                    return 'default';
          }
     };

     const handleFocus = () => {
          setIsFocused(true);
          onFocus && onFocus();
     };

     const handleBlur = () => {
          setIsFocused(false);
          onBlur && onBlur();
          if (onvalidate === 'blur') runValidation(value);
     };

     const handleChangeText = (t: string) => {
          setIsTyping(true);

          onChange && onChange(t);

          if (onvalidate === 'change') runValidation(t);

          if (typingTimeout.current) {
               clearTimeout(typingTimeout.current);
          }

          typingTimeout.current = setTimeout(() => {
               setIsTyping(false);
          }, 800);
     };

     const commonTextInputProps = {
          placeholderTextColor: placeHolderTextColor,
          value: value != null ? String(value) : '',
          editable: !disabled,
          maxLength,
          onChangeText: handleChangeText,
          autoCapitalize: 'none' as const,
          onFocus: handleFocus,
          onBlur: handleBlur,
          underlineColorAndroid: 'transparent',
          selectionColor: colors.PrimaryColor,
          placeholder: placeHolder,
     };

     return (
          <View style={{ gap: 4 }}>
               {type === 'password' ? (
                    <View style={[styles.div, dynamicBorderStyle, { width: divWidth as any, borderWidth: 1.5, borderColor: '#E0E0E0' }, customDivClass, isFocused && styles.divFocused]}>
                         <View style={styles.inputIconContainer}>{isIcon}</View>
                         <TextInput
                              style={[styles.input, { width: isIcon ? '85%' : '95%', backgroundColor: 'transparent', height: height ? height : 55 }, customClass]}
                              secureTextEntry={isPass}
                              {...commonTextInputProps}
                         />
                         <TouchableOpacity onPress={() => setIsPass(prev => !prev)} disabled={disabled}>
                              <Icon name={isPass ? 'eye-slash' : 'eye'} size={20} color={iconColor ? iconColor : colors.PrimaryColor} />
                         </TouchableOpacity>
                    </View>
               ) : type === 'email' && isIcon ? (
                    <View style={[styles.div, { width: divWidth as any, borderWidth: 1.5, borderColor: '#E0E0E0' }, customDivClass, isFocused && styles.divFocused]}>
                         <View style={styles.inputIconContainer}>{isIcon}</View>
                         <TextInput style={[styles.input, { width: '100%', height: height ? height : 55 }, customClass]} keyboardType={getInputType()} {...commonTextInputProps} />
                    </View>
               ) : isIcon ? (
                    <View style={[styles.div, dynamicBorderStyle, { width: divWidth as any, borderWidth: 1.5, borderColor: '#E0E0E0' }, customDivClass, isFocused && styles.divFocused]}>
                         <View style={styles.inputIconContainer}>{isIcon}</View>
                         <TextInput style={[styles.input, { width: '100%', height: height ? height : 55 }, customClass]} keyboardType={getInputType()} {...commonTextInputProps} />
                    </View>
               ) : (
                    <TextInput
                         style={[styles.input, dynamicBorderStyle, { width: inputWidth as any, height: height ? height : 55 }, customClass, isFocused && styles.inputFocused]}
                         keyboardType={getInputType()}
                         multiline={multiline}
                         textAlignVertical={textAlignVertical}
                         {...commonTextInputProps}
                    />
               )}
               {showError && error ? <Text style={[styles.errorText, errorStyle]}>{error}</Text> : null}
          </View>
     );
};

const styles = StyleSheet.create({
     input: {
          borderWidth: 1,
          borderColor: 'transparent',
          borderRadius: 5,
          backgroundColor: 'transparent',
          color: colors.textColor,
          fontFamily: Font.font500,
          fontSize: 16,
          paddingHorizontal: 0,
          textAlignVertical: 'center',
     },
     inputFocused: {
          borderColor: colors.PrimaryColor,
          backgroundColor: 'transparent',
     },
     div: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: '#E0E0E0',
          paddingHorizontal: 16,
          height: 56,
          width: '100%',
     },
     inputIconContainer: {
          marginRight: 12,
     },
     divFocused: {
          borderColor: colors.PrimaryColor, // border visible on focus
          borderWidth: 1.5,
          backgroundColor: 'transparent',
          ...Platform.select({
               android: {
                    elevation: 0,
               },
          }),
     },
     errorText: {
          color: 'red',
          fontSize: 13,
          paddingHorizontal: 4,
          fontFamily: Font.font400,
     },
});

export default React.memo(Field);
