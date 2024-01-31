//hide game screen 
$(window).on('load', function () {
    $('#game').hide();

})
// declare default variable for game 
let suits = ['D', 'C', 'H', 'S']
let value = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
let cards = []
let playerCards = []
let dealerCards = []
let dealerValue = 0
let playerValue = 0
let playerScore = 0
let dealerScore = 0

// create card's deck
function creatDeck() {
//loop through value array
    for (i = 0; i < value.length; i++) {
        //loop through suits array
        for (j = 0; j < suits.length; j++) {
            //push completed card to array 
            cards.push(`${value[i]}-${suits[j]}`)
        }
    }
}
//deal function
function deal() {
    cards = []
    playerCards = []
    dealerCards = []
    dealerValue = 0
    playerValue = 0
    creatDeck()
    shuffleCards(cards)
    //hide greeting screen
    $('#greeting').hide()
    //show game screen
    $('#game').show(1000)
    //hide deal button until end the game 
    $('#deal_btn').hide()

    $('#deal_again').hide()

    getFirstCards()
    checkStart.blackJack()
}
//show game screen after greeting 
$('#greeting_start_btn').on('click', function () {
    deal()
});

// shuffle created deck 
//takes this function from https://learn.javascript.ru/task/shuffle
//Fisher–Yates shuffle / The modern algorithm / 
function shuffleCards(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));          // random index from 0 to i
        let t = cards[i];
        arr[i] = arr[j];
        arr[j] = t
    }
    return arr
}

// push first player's and dealer's cards / print to the srceen
function getFirstCards() {
    //get first cards when deal start for player
    for (i = 0; i < 2; i++) {
        let card = cards.pop(Math.floor(Math.random() * cards.length))
        playerCards.push(card)
        $('#player_table').append(`<img class="player-cards" src="./assets/img/cards/${playerCards[i]}.png" alt="">`)
    }
    getPlayerValue()

    //get first cards when deal start for dealer
    for (i = 0; i < 1; i++) {
        let card = cards.pop(Math.floor(Math.random() * cards.length))//take random element from the array 
        dealerCards.push(card) // push taken element to declared variable 
        $('#dealer_table').append(`<img id="dealer_cards" class="dealer-cards" src="./assets/img/cards/${dealerCards[i]}.png" alt="">`) //print card
        $('#dealer_table').append(`<img id="dealer_cards" class="dealer-cards back" src="./assets/img/cards/BACK.png" alt="">`)
    }
    getDealerValue()
}

// push one more card if the function was called (arr) - argument to show which player to add a card
// if (arr) = playerCards => add card to player
// if (arr) = dealerCards => add card to dealer
function getCard(arr) {
    //when player ask to take one more card 'hit'
    if (arr == playerCards) {
        arr.push(cards.pop(Math.floor(Math.random() * cards.length)))
        $(`#player_table`).append(`<img class="player-cards" src="./assets/img/cards/${arr.at(-1)}.png" alt="">`)

        getPlayerValue()
    }
    //when dealer ask to take one more card 'stand' if condition is available 
    if (arr == dealerCards) {
        //if dealer value lass than 17 - can take card 
        while (dealerValue < 17) {
            arr.push(cards.pop(Math.floor(Math.random() * cards.length)))
            $('#dealer_table').append(`<img id="dealer_cards" class="dealer-cards" src="./assets/img/cards/${arr.at(-1)}.png" alt="">`)

            getDealerValue()
        }
    }
}

// get current player value 
function getPlayerValue() {
    //have to set 'playerValue' to 0 to don't have mistake while count value 
    playerValue = 0
    //make for loop to through array of taken cards 
    for (i = 0; i < playerCards.length; i++) {
        //split 'i' element by 0 index to get indicator of card
        let splitted = playerCards[i].split('-')
        //if card's indicator in not a number (A,K,J,Q) go inside if statment
        if (isNaN(splitted[0])) {
            //if card's indicator == Ace / 'A' go inside 
            if (splitted[0] == 'A') {
                //add value of the card 
                playerValue += 11
                //if player has Ace and has value more than 21 with the Ace - 10 from current value (Ace condition)
                if (playerValue > 21) playerValue -= 10


            } else {
                playerValue += 10
            }
        } else {
            // parseInt to be sure that return integer 
            playerValue += parseInt(splitted[0])
        }

        $('#player_value').html(playerValue)
    }
}

//get current dealer value 
function getDealerValue() {
    //have to set 'playerValue' to 0 to don't have mistake while count value 
    dealerValue = 0
    //make for loop to through array of taken cards 
    for (i = 0; i < dealerCards.length; i++) {
        //split 'i' element by 0 index to get indicator of card
        let splitted = dealerCards[i].split('-')
            //if card's indicator in not a number (A,K,J,Q) go inside if statment
        if (isNaN(splitted[0])) {
            //if card's indicator == Ace / 'A' go inside 
            if (splitted[0] == 'A') {
                //add value of the card
                dealerValue += 11
                //if player has Ace and has value more than 21 with the Ace - 10 from current value (Ace condition)
                if (dealerValue > 21) dealerValue -= 10
            } else {
                dealerValue += 10
            }
        } else {
            // parseInt to be sure that return integer 
            dealerValue += parseInt(splitted[0])
        }
        $('#dealer_value').html(dealerValue)
    }
}

// if 'hit' button press add one more card to player hand and check current value for end the game or continue 
$('#hit_btn').on('click', function () {
    getCard(playerCards)
    if (playerValue > 21 || playerValue == 21) {

        endGame()
    }
   
})

// if 'stand' button press add one card to dealer hand while dealerValue < 17 and check current value for end the game or take one more card

$('#stand_btn').on('click', function () {
    $('.back').hide()
    getCard(dealerCards)
    endGame()
});
// reset all value for new deal
$('#deal_btn').on('click', function () {
    newDeal()
})
// reset function 'newDeal' to reset all value
function newDeal() {
    $('#player_value').text('')
    $('#dealer_value').text('')
    $('#player_table').empty()
    $('#dealer_table').empty()
    $('#hit_btn').show()
    $('#stand_btn').show()
    $('#current_info').html('Good Luck!')
    $('.dealer').removeClass('redLabel')
    $('.player').removeClass('redLabel')
    $('.player').removeClass('greenLabel')
    $('.dealer').removeClass('greenLabel')

    deal()
}

//check if somebody has blackjack "21" from the start game 
const checkStart = {
    blackJack() {
        if (playerValue === 21) {
            $('#current_info').html(`!BlackJack! Player WIN !`)
            $('#player_score').html(++playerScore)
            info()
        }
        if (dealerValue === 21) {
            $('#current_info').html(`s BlackJack! Dealer WIN !`)
            $('#dealer_score').html(++dealerScore)
            info()
        }
    }

}

// check the condition to stop current game and print who is winner and count score
function endGame() {
    function info() {
        $('#hit_btn').hide()
        $('#stand_btn').hide()
        $('#deal_btn').show()

    }

    // make green label to show who won
    // make red label to show who lost

    if (playerValue === 21 && dealerValue < 21) {
        $('.player').addClass('greenLabel') 
        $('.dealer').addClass('redLabel')
        $('#current_info').html(`!BlackJack! Player WIN!`)
        $('#player_score').html(++playerScore)
        $('#deal_again').show()
        info()
    } else if (dealerValue === 21) {
        $('.dealer').addClass('greenLabel')
        $('.player').addClass('redLabel')
        $('#current_info').html(`!BlackJack! Dealer WIN!`)
        $('#dealer_score').html(++dealerScore)
        $('#deal_again').show()
        info()
    } else if (dealerValue > 21 || playerValue > dealerValue && playerValue < 21) {
        $('.player').addClass('greenLabel')
        $('.dealer').addClass('redLabel')
        $('#current_info').html(`Player WIN!`)
        $('#player_score').html(++playerScore)
        $('#deal_again').show()
        info()
    } else if (playerValue < 21 && playerValue < dealerValue && dealerValue <= 21 || playerValue > 21) {
        $('.dealer').addClass('greenLabel')
        $('.player').addClass('redLabel')
        $('#current_info').html(`Dealer WIN!`)
        $('#dealer_score').html(++dealerScore)
        $('#deal_again').show()
        info()
    } else if (playerValue === dealerValue) {
        $('#current_info').html(`Draw`)
        $('#deal_again').show()
        info()
    }

}
