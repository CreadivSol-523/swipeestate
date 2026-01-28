import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface IconProps {
     name: string;
     size?: number;
     color?: string;
     style?: object;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, color = '#000', style }) => {
     const icons: { [key: string]: string } = {
          // Communication & Contact
          mail: '✉️',
          phone: '📱',
          call: '📞',
          message: '💬',
          chat: '💭',
          notification: '🔔',

          // Security & Privacy
          lock: '🔒',
          unlock: '🔓',
          key: '🔑',
          shield: '🛡️',
          eye: '👁️',
          eyeOff: '🙈',

          // Navigation & Actions
          home: '🏠',
          search: '🔍',
          menu: '☰',
          settings: '⚙️',
          filter: '🔽',
          back: '◀️',
          forward: '▶️',
          up: '▲',
          down: '▼',
          close: '✕',
          check: '✓',
          plus: '➕',
          minus: '➖',

          // Social & Engagement
          heart: '❤️',
          like: '👍',
          dislike: '👎',
          star: '⭐',
          bookmark: '🔖',
          share: '↗️',
          comment: '💬',

          // User & Profile
          user: '👤',
          users: '👥',
          profile: '😊',
          avatar: '🧑',

          // Location & Places
          location: '📍',
          pin: '📌',
          map: '🗺️',
          city: '🏙️',
          building: '🏢',
          house: '🏡',

          // Finance & Money
          money: '💰',
          dollar: '💵',
          rupee: '₹',
          income: '💸',
          wallet: '👛',
          credit: '💳',
          bank: '🏦',
          chart: '📊',
          trending: '📈',

          // Time & Calendar
          calendar: '📅',
          clock: '🕐',
          time: '⏰',
          date: '📆',

          // Documents & Files
          file: '📄',
          folder: '📁',
          document: '📃',
          pdf: '📕',
          image: '🖼️',
          camera: '📷',
          video: '🎥',

          // E-commerce & Shopping
          cart: '🛒',
          bag: '🛍️',
          gift: '🎁',
          tag: '🏷️',

          // Weather & Nature
          sun: '☀️',
          moon: '🌙',
          cloud: '☁️',
          rain: '🌧️',
          thunder: '⛈️',

          // Misc & UI
          sparkles: '✨',
          fire: '🔥',
          warning: '⚠️',
          info: 'ℹ️',
          help: '❓',
          edit: '✏️',
          trash: '🗑️',
          download: '⬇️',
          upload: '⬆️',
          refresh: '🔄',

          // Social Media
          google: 'G',
          facebook: 'f',
          twitter: '🐦',
          instagram: '📷',
          linkedin: '💼',

          // Work & Education
          briefcase: '💼',
          education: '🎓',
          book: '📚',
          pen: '🖊️',

          // Food & Drinks
          food: '🍔',
          coffee: '☕',
          restaurant: '🍽️',

          // Transport
          car: '🚗',
          bus: '🚌',
          bike: '🚲',
          plane: '✈️',

          // Health & Fitness
          health: '🏥',
          fitness: '💪',
          heart_health: '💗',
     };

     return <Text style={[styles.icon, { fontSize: size, color }, style]}>{icons[name] || '•'}</Text>;
};

const styles = StyleSheet.create({
     icon: {
          textAlign: 'center',
     },
});

export default Icon;
