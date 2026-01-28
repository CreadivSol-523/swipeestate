import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Field from '../Field/Field';
import colors from '../../assests/color/color';
import Icon from '../Icons/Icons';
import Font from '../../assests/fonts/Font';

const FieldWrapper = ({
     icon,
     label,
     placeholder,
     value,
     onChangeText,
     fieldType = 'password',
     error,
     disable = false,
}: {
     icon: string;
     label: string;
     placeholder: string;
     value: string;
     onChangeText: (text: string) => void;
     fieldType?: 'text' | 'password' | 'email' | 'number' | 'phone';
     error?: string;
     disable?: boolean;
}) => {
     return (
          <View style={styles.inputContainer}>
               <Text style={styles.label}>{label}</Text>
               <Field
                    disabled={disable}
                    value={value}
                    onChange={text => onChangeText(text)}
                    type={fieldType}
                    placeHolderTextColor="#999"
                    placeHolder={placeholder}
                    isIcon={<Icon name={icon} size={20} color={colors.PrimaryColor} />}
               />
               {error && (
                    <View style={{ paddingLeft: 10, paddingTop: 5 }}>
                         <Text style={{ color: 'red' }}>{error}</Text>
                    </View>
               )}
          </View>
     );
};

export default FieldWrapper;

const styles = StyleSheet.create({
     inputContainer: {
          marginBottom: 20,
     },
     label: {
          fontSize: 14,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 8,
     },
});
