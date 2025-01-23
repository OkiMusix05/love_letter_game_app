import React, { useRef, useImperativeHandle, useState, forwardRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

const card_imgs: { [key: number]: any } = {
    11: require('../assets/cards/cardback_4x.png'),
    0: require('../assets/cards/card0_4x.png'),
    1: require('../assets/cards/card1_4x.png'),
    2: require('../assets/cards/card2_4x.png'),
    3: require('../assets/cards/card3_4x.png'),
    4: require('../assets/cards/card4_4x.png'),
    5: require('../assets/cards/card5_4x.png'),
    6: require('../assets/cards/card6_4x.png'),
    7: require('../assets/cards/card7_4x.png'),
    8: require('../assets/cards/card8_4x.png'),
    9: require('../assets/cards/card9_4x.png'),
    10: require('../assets/cards/card10_4x.png'),
};

type CardProps = {
    n: number;
};

export type CardRef = {
    flipCard: () => void;
};

const Card = forwardRef<CardRef, CardProps>((props:CardProps, ref) => {
    const [isFront, setIsFront] = useState(false);
    const rotation = useRef(new Animated.Value(isFront ? 0 : 1)).current;

    const flipCard = () => {
        Animated.timing(rotation, {
            toValue: isFront ? 1 : 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setIsFront(!isFront);
        });
    };

    useImperativeHandle(ref, () => ({
        flipCard,
    }));

    const frontRotation = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });
    const backRotation = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    return (
        <View style={styles.cardContainer}>
            {/* Front of the card */}
            <Animated.View
                style={[
                    styles.card,
                    {
                        transform: [{ rotateY: frontRotation }],
                        backfaceVisibility: 'hidden',
                    },
                ]}
            >
                <Image source={card_imgs[props.n]} style={styles.cardImage} />
            </Animated.View>
            {/* Back of the card */}
            <Animated.View
                style={[
                    styles.card,
                    {
                        transform: [{ rotateY: backRotation }],
                        backfaceVisibility: 'hidden',
                    },
                ]}
            >
                <Image source={card_imgs[11]} style={styles.cardImage} />
            </Animated.View>
        </View>
    );
});

const styles = StyleSheet.create({
    cardContainer: {
        width: 176,
        height: 256,
        perspective: "100px",
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default Card;

export const getDeckImage = (number: number): any => {
    if (number > 4) {
        return require('../assets/images/deck/deck image full_4x.png');
    }
    switch (number) {
        case 4:
            return require('../assets/images/deck/deck image 4_4x.png');
        case 3:
            return require('../assets/images/deck/deck image 3_4x.png');
        case 2:
            return require('../assets/images/deck/deck image 2_4x.png');
        case 1:
            return require('../assets/images/deck/deck image 1_4x.png');
        case 0:
            return require('../assets/images/deck/deck image empty_4x.png');
        default:
            return require('../assets/images/deck/deck image full_4x.png'); // Fallback image
    }
};

