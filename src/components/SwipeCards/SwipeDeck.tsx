import React from 'react';
import { View } from 'react-native';
import SwipeCard from './SwipeCard';

type Props = {
     data: any[];
     renderCard: (item: any) => React.ReactNode;
     onSwipeLeft: (item: any, index: number) => void;
     onSwipeRight: (item: any, index: number) => void;
     disableLeftSwipe?: boolean;
     disableRightSwipe?: boolean;
};

const SwipeDeck = ({ data, renderCard, onSwipeLeft, onSwipeRight, disableLeftSwipe, disableRightSwipe }: Props) => {
     return (
          <View style={{ flex: 1 }}>
               {data
                    .slice(0, 5)
                    .reverse()
                    .map((item, index) => (
                         <SwipeCard
                              key={item.id}
                              index={index}
                              disableLeftSwipe={disableLeftSwipe}
                              disableRightSwipe={disableRightSwipe}
                              onSwipeLeft={() => onSwipeLeft(item, index)}
                              onSwipeRight={() => onSwipeRight(item, index)}
                         >
                              {renderCard(item)}
                         </SwipeCard>
                    ))}
          </View>
     );
};

export default SwipeDeck;
