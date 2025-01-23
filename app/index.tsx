import React, { useRef, useState } from 'react';
import { View, StyleSheet, Button, Animated, Image, GestureResponderEvent, Dimensions, Easing } from 'react-native';
import Card, { CardRef, getDeckImage } from './cards';
import * as Haptics from 'expo-haptics';

const shuffleDeck = (deck: number[]): number[] => {
    const shuffledDeck = [...deck]; // Create a copy of the deck to avoid mutating the original state
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index between 0 and i
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]]; // Swap elements
    }
    return shuffledDeck; // Return the shuffled deck
};

const App = () => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [deck, setDeck] = useState<number[]>(shuffleDeck([1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 0]));
    const handleShuffle = () => {
        setDeck(shuffleDeck(deck));
    };
    const [handCards, setHandCards] = useState<{
        id: number; value: number, opacity: Animated.Value, translateY: Animated.Value,
        frameOpacity: Animated.Value,
    }[]>([]);
    const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
    const [liftedCardId, setLiftedCardId] = useState<number | null>(null); // Track lifted card
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    // Refs for all cards
    const cardRefs = useRef<{ [key: number]: React.RefObject<CardRef> }>({});
    const drawnCardPosition = useRef(new Animated.ValueXY({ x: 16, y: 0 })).current;
    const drawnCardOpacity = useRef(new Animated.Value(1)).current;
    const addCard = () => {
        if (deck.length === 0) {
            console.log("No more cards in the deck");
            return;
        }
        if (handCards.length == 2) {
            console.log("Can't have more than 2 cards simultaneously");
            return;
        }

        const newCard = {
            id: handCards.length + 1, value: deck[deck.length - 1], opacity: new Animated.Value(0),
            translateY: new Animated.Value(0), frameOpacity: new Animated.Value(0),
        }; // Random card value
        setHandCards((prev) => [...prev, newCard]);
        setDeck(deck.slice(0, deck.length - 1));

        // Initialize ref for the new card
        if (!cardRefs.current[newCard.id]) {
            cardRefs.current[newCard.id] = React.createRef<CardRef>();
        }
        Animated.sequence([
            Animated.timing(drawnCardOpacity, {
                toValue: 1,
                duration: 5,
                useNativeDriver: true,
            }),
            Animated.timing(drawnCardPosition, {
                toValue: {x: 32, y: -64},
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(drawnCardPosition, {
                toValue: {x: (handCards.length == 0 ? 8 : 98), y: 312}, // Move to hand position (customize layout)
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(newCard.opacity, {
               toValue: 1,
               duration: 20,
               useNativeDriver: true,
            }),
            Animated.timing(drawnCardOpacity, {
                toValue: 0,
                duration: 5,
                useNativeDriver: true,
            })
        ]).start(() => {
            cardRefs.current[newCard.id]?.current?.flipCard();
            drawnCardPosition.setValue({x: 16, y: 0}); // Reset position for next card
        });
    }

    // Selecting a Card
    const holdTimeout = useRef<NodeJS.Timeout | null>(null);

    const selectCard = (selectedCardId: number | null) => {
        if (selectedCardId !== null) {
            if (holdTimeout.current) {
                clearTimeout(holdTimeout.current);
            }
            holdTimeout.current = setTimeout(() => {
                const selectedCard = handCards.find(card => card.id === selectedCardId);
                if (selectedCard && hoveredCardId === selectedCardId) { // Ensure the same card is still hovered
                    Animated.timing(selectedCard.frameOpacity, {
                        toValue: 1, // Fully visible
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    });
                }
            }, 1000); // 1-second delay
        } else {
            if (holdTimeout.current) {
                clearTimeout(holdTimeout.current);
            }
            handCards.forEach(card => {
                Animated.timing(card.frameOpacity, {
                    toValue: 0, // Fully transparent
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }
    };
    if (handCards.length === 2) {
        selectCard(selectedCardId);
    }

    const handleMove = (e: GestureResponderEvent) => {
        if (handCards.length === 2) {
            const { pageX, locationY } = e.nativeEvent;
            //console.log(pageX, locationY);

            let currentlyHoveredCardId: number | null = null;

            handCards.forEach((card, index) => {
                // Define the card's position and dimensions
                const cardXStart = index * 176 + 10; // Example horizontal spacing for cards
                const cardXEnd = cardXStart + 176;
                const cardYStart = 0;
                const cardYEnd = 256;

                // Check if the finger is over the card
                if (
                    pageX >= cardXStart &&
                    pageX <= cardXEnd &&
                    locationY >= cardYStart &&
                    locationY <= cardYEnd
                ) {
                    currentlyHoveredCardId = card.id;

                    // Lift the card if it's the hovered card
                    if (hoveredCardId !== card.id) {
                        Animated.timing(card.translateY, {
                            toValue: -30,
                            duration: 150,
                            useNativeDriver: true,
                        }).start();
                        setSelectedCardId(card.id);
                    }

                    // Update the position of the lifted card
                    if (liftedCardId === card.id) {
                        Animated.timing(card.translateY, {
                            toValue: locationY - 128, // Adjust this to position it relative to the finger
                            duration: 0, // Instant move
                            useNativeDriver: true,
                        }).start();
                    }
                } else if (hoveredCardId === card.id) {
                    // Lower the card if the finger moves away
                    Animated.timing(card.translateY, {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: true,
                    }).start();
                }
            });

            // Update the currently hovered card
            setHoveredCardId(currentlyHoveredCardId);
        } else if (handCards.length === 1) {
            // Add info about the card here
        }
    };

    const handleRelease = () => {
        if (hoveredCardId !== null) {
            console.log('Card Selected:', hoveredCardId);
        }

        // Reset position of the lifted card
        handCards.forEach((card) => {
            if (liftedCardId === card.id) {
                Animated.timing(card.translateY, {
                    toValue: -30,
                    duration: 150,
                    useNativeDriver: true,
                }).start();
            } else {
                Animated.timing(card.translateY, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }).start();
            }
        });

        setLiftedCardId(null); // Reset lifted card state
        setHoveredCardId(null); // Reset hover state
        setSelectedCardId(null);
    };


    return (
        <View style={styles.container}>
            <Button title="Draw Card" onPress={addCard} />
            <Button title="Reset" onPress={() => setHandCards([]) /*Dev Button*/} />
            <View>
                <Image source={getDeckImage(deck.length)} style={styles.deckImage} id={"deck_image"}/>
                <Animated.View style={[styles.cardAnimation, { transform: drawnCardPosition.getTranslateTransform(), opacity: drawnCardOpacity }]}>
                    <Image source={require('../assets/cards/cardback_4x.png')} style={styles.cardImage} />
                </Animated.View>
            </View>
            <View style={styles.hand}
                  onStartShouldSetResponder={() => true}
                  onResponderMove={handleMove}
                  onResponderGrant={handleMove}
                  onResponderRelease={handleRelease}
            >
                {handCards.map((card) => (
                    <Animated.View key={card.id} style={[ styles.cardWrapper, {opacity: card.opacity, transform: [{translateY: card.translateY}] }]}
                                   //onStartShouldSetResponder={() => true}
                                   //onResponderGrant={handlePressIn}
                                   //onResponderRelease={handleRelease}
                    >
                        <Card ref={cardRefs.current[card.id]} n={card.value}/>
                        <Animated.View style={[StyleSheet.absoluteFillObject, {opacity: card.frameOpacity}]}>
                            <Image source={require('../assets/images/frames/card_select_frame_purple.png')}
                                   /*style={StyleSheet.absoluteFillObject}*//>
                        </Animated.View>
                    </Animated.View>
                ))}
            </View>

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deckImage: {
        width: 192,
        height: 272,
        marginBottom: 20,
    },
    cardAnimation: {
        position: 'absolute',
        width: 176,
        height: 256,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    hand: {
        flexDirection: 'row',
        marginTop: 20,
    },
    cardWrapper: {
        marginHorizontal: 2,
    },
});
export default App;