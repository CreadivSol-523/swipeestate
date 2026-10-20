// SwipeDeck.tsx
import React from 'react';
import { View } from 'react-native';
import SwipeCard from './SwipeCard';

type Props = {
     data: any[];
     renderCard: (item: any) => React.ReactNode;
     onSwipeLeft: (item: any, stackPosition: number) => void;
     onSwipeRight: (item: any, stackPosition: number) => void;
     disableLeftSwipe?: boolean;
     disableRightSwipe?: boolean;
};

const MAX_VISIBLE_CARDS = 5;

const SwipeDeck = ({ data, renderCard, onSwipeLeft, onSwipeRight, disableLeftSwipe, disableRightSwipe }: Props) => {
     return (
          <View style={{ flex: 1 }}>
               {data
                    .slice(0, MAX_VISIBLE_CARDS)
                    .map((item, stackPosition) => ({ item, stackPosition }))
                    // Reverse only for render order: front card (stackPosition 0)
                    // must render LAST so it sits visually on top of the stack.
                    .reverse()
                    .map(({ item, stackPosition }) => (
                         <SwipeCard
                              key={item.id}
                              index={stackPosition}
                              disableLeftSwipe={disableLeftSwipe}
                              disableRightSwipe={disableRightSwipe}
                              onSwipeLeft={() => onSwipeLeft(item, stackPosition)}
                              onSwipeRight={() => onSwipeRight(item, stackPosition)}
                         >
                              {renderCard(item)}
                         </SwipeCard>
                    ))}
          </View>
     );
};

export default SwipeDeck;
