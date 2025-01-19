/*
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Button, Image } from 'react-native';
import Card, { CardRef } from './cards';

const App = () => {
    const deck:number[] = [1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 0];
    const [cards, setCards] = useState([
        { id: 1, value: 3 },
    ]);

    // Refs for all cards
    const cardRefs = useRef<{ [key: number]: React.RefObject<CardRef> }>({});

    // Initialize refs dynamically
    cards.forEach((card) => {
        if (!cardRefs.current[card.id]) {
            cardRefs.current[card.id] = React.createRef<CardRef>();
        }
    });

    const handleFlip = (id: number) => {
        const cardRef = cardRefs.current[id];
        if (cardRef?.current) {
            cardRef.current.flipCard();
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/deck image_4x.png')} />
            {cards.map((card) => (
                <View key={card.id} style={styles.cardWrapper}>
                    <Card ref={cardRefs.current[card.id]} n={card.value} />
                    <Button title="Flip Card" onPress={() => handleFlip(card.id)} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardWrapper: {
        marginBottom: 20,
        alignItems: 'center',
    },
});

export default App;
*/
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Button, Animated, Image } from 'react-native';
import Card, { CardRef } from './cards';

const shuffleDeck = (deck: number[]): number[] => {
    const shuffledDeck = [...deck]; // Create a copy of the deck to avoid mutating the original state
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index between 0 and i
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]]; // Swap elements
    }
    return shuffledDeck; // Return the shuffled deck
};

const CardList = () => {
    const [deck, setDeck] = useState<number[]>(shuffleDeck([1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 0]));
    const handleShuffle = () => {
        setDeck(shuffleDeck(deck));
    };
    const [handCards, setHandCards] = useState<{ id: number; value: number, opacity: Animated.Value, translateY: Animated.Value}[]>([]);

    // Refs for all cards
    const cardRefs = useRef<{ [key: number]: React.RefObject<CardRef> }>({});
    const drawnCardPosition = useRef(new Animated.ValueXY({ x: 16, y: 0 })).current;
    const addCard = () => {
        if (deck.length === 0) {
            console.log("No more cards in the deck");
            return;
        }
        if (handCards.length == 2) {
            console.log("Can't have more than 2 cards simultaneously");
            return;
        }

        const newCard = {id: handCards.length + 1, value: deck[deck.length - 1], opacity: new Animated.Value(0), translateY: new Animated.Value(0) }; // Random card value
        setHandCards((prev) => [...prev, newCard]);
        setDeck(deck.slice(0, deck.length - 1));

        // Initialize ref for the new card
        if (!cardRefs.current[newCard.id]) {
            cardRefs.current[newCard.id] = React.createRef<CardRef>();
        }
        Animated.sequence([
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
        ]).start(() => {
            cardRefs.current[newCard.id]?.current?.flipCard();
            drawnCardPosition.setValue({x: 16, y: 0}); // Reset position for next card
        });
    }

    const handlePressIn = (card: { id: number }) => {
        const currentCard = handCards.find((c) => c.id === card.id);
        if (currentCard) {
            Animated.timing(currentCard.translateY, {
                toValue: -30, // Lift the card by 10 pixels
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePressOut = (card: { id: number }) => {
        const currentCard = handCards.find((c) => c.id === card.id);
        if (currentCard) {
            Animated.timing(currentCard.translateY, {
                toValue: 0, // Return the card to its original position
                duration: 150,
                useNativeDriver: true,
            }).start(() => {
                console.log("Card Selected"); // Log when the card is selected
            });
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Draw Card" onPress={addCard} />
            <Button title="Reset" onPress={() => setHandCards([]) /*Dev Button*/} />
            <View>
                <Image source={require('../assets/images/deck image_4x.png')} style={styles.deckImage} id={"deck_image"}/>
                <Animated.View style={[styles.cardAnimation, { transform: drawnCardPosition.getTranslateTransform() }]}>
                    <Image source={require('../assets/cards/cardback_4x.png')} style={styles.cardImage} />
                </Animated.View>
            </View>
            <View style={styles.hand}>
                {handCards.map((card) => (
                    <Animated.View key={card.id} style={[ styles.cardWrapper, {opacity: card.opacity, transform: [{translateY: card.translateY}] }]}
                                   onStartShouldSetResponder={() => true}
                                   onResponderGrant={() => handlePressIn(card)}
                                   onResponderRelease={() => handlePressOut(card)}>
                        <Card ref={cardRefs.current[card.id]} n={card.value} />
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
export default CardList;