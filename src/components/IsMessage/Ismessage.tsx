import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { windowHeight } from '../../utils/Dimension/Dimension';
import colors from '../../assests/Colors/Colors';

interface isMessageProps {
     text?: string;
     height?: number;
}
const Ismessage = ({ text, height }: isMessageProps) => {
     return (
          <View style={{ justifyContent: 'center', alignItems: 'center', height: height ? height : windowHeight * 0.9 }}>
               <Text style={{ fontSize: 25, fontWeight: '600', color: colors.gray }}>{text ? text : 'Message'}</Text>
          </View>
     );
};

export default Ismessage;

const styles = StyleSheet.create({});
