import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../assests/color/color';

interface Props {
     children: ReactNode;
     fallbackTitle?: string;
}

interface State {
     hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
     state: State = { hasError: false };

     static getDerivedStateFromError(): State {
          return { hasError: true };
     }

     componentDidCatch(error: Error, errorInfo: ErrorInfo) {
          console.error('ErrorBoundary caught:', error, errorInfo);
     }

     handleRetry = () => {
          this.setState({ hasError: false });
     };

     render() {
          if (this.state.hasError) {
               return (
                    <View style={styles.container}>
                         <Text style={styles.title}>{this.props.fallbackTitle || 'Something went wrong'}</Text>
                         <Text style={styles.subtitle}>An unexpected error occurred. Please try again.</Text>
                         <TouchableOpacity style={styles.button} onPress={this.handleRetry} activeOpacity={0.8}>
                              <Text style={styles.buttonText}>Try Again</Text>
                         </TouchableOpacity>
                    </View>
               );
          }

          return this.props.children;
     }
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          backgroundColor: colors.SecondaryColor,
     },
     title: {
          fontSize: 22,
          fontWeight: '600',
          color: colors.black,
          textAlign: 'center',
          marginBottom: 8,
     },
     subtitle: {
          fontSize: 15,
          color: colors.gray,
          textAlign: 'center',
          marginBottom: 24,
     },
     button: {
          backgroundColor: colors.PrimaryColor,
          paddingHorizontal: 28,
          paddingVertical: 12,
          borderRadius: 8,
     },
     buttonText: {
          color: colors.white,
          fontSize: 16,
          fontWeight: '600',
     },
});

export default ErrorBoundary;
