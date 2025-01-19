/*
import React from 'react';
import {Text, ImageSourcePropType, StyleSheet, View, Animated, TouchableOpacity} from 'react-native';
import { Image } from 'expo-image';

const card_imgs: { [key: number]: ImageSourcePropType } = {
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
    n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}
const Card:React.FC<CardProps> = (props: CardProps) => {
    const [isFront, setFront] = React.useState(false);
    //return <Image source={card_imgs[props.n]}  style={styles.cardImage}/>;
    return (
        <View style={styles.cardContainer}>
            {/!* Back of the card *!/}
            <Image source={card_imgs[11]} style={[styles.cardImage, !isFront && styles.visible]} />

            {/!* Front of the card *!/}
            <Image source={card_imgs[props.n]} style={[styles.cardImage, isFront && styles.visible]} />
        </View>
    );
}
const styles = StyleSheet.create({
    cardContainer: {
        width: 176,
        height: 256,
        position: 'relative', // Ensure that images stack within this container
    },
    /!*cardImage: {
        width: 176,
        height: 256,
        resizeMode: 'contain',
        //transform: [{ scale: 1 }],
    },*!/
    cardImage: {
        position: 'absolute', // Position images on top of each other
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        zIndex: 1, // Default zIndex
        opacity: 0, // Initially hidden
    },
    visible: {
        zIndex: 2,
        opacity: 1,
    },
});
export default Card;*/
/*
import React, { useRef, useState, useImperativeHandle, ForwardedRef, forwardRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Image,
    TouchableOpacity,
    Text,
} from 'react-native';

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
    n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
};
export type CardRef = {
    flipCard: () => void;
};

const Card: React.forwardRef<CardProps, CardRef> = (props: CardProps, ref: ForwardedRef<CardRef>) => {
    const rotation = useRef(new Animated.Value(0)).current; // Animated value for rotation
    const [isFront, setIsFront] = useState(true); // Track if front or back is visible

    const flipCard = () => {
        Animated.timing(rotation, {
            toValue: isFront ? 1 : 0, // Rotate to 180deg or back to 0deg
            duration: 500, // Animation duration in ms
            useNativeDriver: true, // Optimize for native performance
        }).start(() => {
            setIsFront(!isFront);
        });
    };

    useImperativeHandle(ref, () => ({
        flipCard,
    }));
    const frontRotation = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'], // Front rotates from 0 to 180
    });
    const backRotation = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'], // Back rotates from 180 to 360
    });

    return (
        <View style={styles.cardContainer}>
            {/!* Front of the card *!/}
            <Animated.View
                style={[
                    styles.card,
                    {
                        transform: [{ rotateY: frontRotation }],
                        backfaceVisibility: 'hidden', // Hide back when front is visible
                    },
                ]}
            >
                <Image source={card_imgs[n]} style={styles.cardImage} />
            </Animated.View>

            {/!* Back of the card *!/}
            <Animated.View
                style={[
                    styles.card,
                    {
                        transform: [{ rotateY: backRotation }],
                        backfaceVisibility: 'hidden', // Hide front when back is visible
                    },
                ]}
            >
                <Image source={card_imgs[11]} style={styles.cardImage} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    cardContainer: {
        width: 176,
        height: 256,
        //perspective: "100px",
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
    button: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default Card;

*/
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

const Card = forwardRef<CardRef, CardProps>(({ n }, ref) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const [isFront, setIsFront] = useState(false);

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
                <Image source={card_imgs[n]} style={styles.cardImage} />
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

