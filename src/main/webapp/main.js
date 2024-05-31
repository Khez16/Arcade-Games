// Get DOM elements
const player1ScoreDisplay = document.querySelector('.Player1 .Score');
const player2ScoreDisplay = document.querySelector('.Player2 .Score');
const turnDisplay = document.querySelector('.Turn');
const rockButton = document.querySelector('.Rock');
const paperButton = document.querySelector('.Paper');
const scissorButton = document.querySelector('.Scissor');
const winnerAnnouncement = document.querySelector('.WinnerAnnouncement');
const player2ChoiceDisplay = document.querySelector('.Player2Choice');
const chatInput = document.querySelector('.ChatInput');
const chatMessages = document.querySelector('.ChatMessages');
const imageContainer = document.getElementById('imageContainer');
let userMessage = null; // Variable to store user's message
const API_KEY = "sk-proj-JFBfc6EuGvYkL7Bil8kDT3BlbkFJ2Xy8YpOuyyIZUyC6NxVy"; //API Key

// Initialize scores
let player1Score = 0;
let player2Score = 0;

// Initialize player choices
let player1Choice = null;
let player2Choice = null;

// Function to update scores and display winner announcement
function updateScoresAndAnnouncement(winner) {
    if (winner === 'Player 1') {
        player1Score++;
        player1ScoreDisplay.textContent = player1Score;
        winnerAnnouncement.textContent = 'Player 1 wins!';
    } else if (winner === 'Player 2') {
        player2Score++;
        player2ScoreDisplay.textContent = player2Score;
        winnerAnnouncement.textContent = 'Player 2 wins!';
    } else {
        winnerAnnouncement.textContent = "It's a tie!";
    }
}

// Function to update turn display and Player 2 choice display
function updateTurnAndPlayer2Choice(player1Choice, player2Choice) {
    turnDisplay.textContent = "Player 2's Turn";
    player2ChoiceDisplay.textContent = `Player 2 chose ${player2Choice}`;
}

// Function to show the image and hide it after a certain amount of time
function showImage(player1Choice, player2Choice, winner) {
    const player1Image = document.createElement('img');
    const player2Image = document.createElement('img');
    const winnerImage = document.createElement('img');

    // Set image sources based on player choices
    player1Image.src = `./img/${player1Choice}.jpg`;
    player2Image.src = `./img/${player2Choice}.jpg`;

    // Determine the winning image source
    let winnerSrc;
    if (winner === 'Player 1') {
        winnerSrc = `./img/Defeated ${player2Choice}.jpg`;
    } else if (winner === 'Player 2') {
        winnerSrc = `./img/Defeated ${player1Choice}.jpg`;
    } else {
        // If it's a tie, you can set a default tie image
        winnerSrc = '';
    }
    winnerImage.src = winnerSrc;

    // Set image classes for styling
    player1Image.classList.add('player1-image');
    player2Image.classList.add('player2-image');
    winnerImage.classList.add('winner-image');

    // Append player images to the image container
    imageContainer.appendChild(player1Image);
    imageContainer.appendChild(player2Image);

    // Display the image container
    imageContainer.style.display = 'flex';

    // Hide the player images after a certain amount of time
    setTimeout(function() {
        // Remove player images from the container
        imageContainer.removeChild(player1Image);
        imageContainer.removeChild(player2Image);

        // Set the winner image source and append it to the container
        winnerImage.src = winnerSrc;
        imageContainer.appendChild(winnerImage);
    }, 2000); // Adjust the time (in milliseconds) as per your requirement

    // Hide the image container after another certain amount of time
    setTimeout(function() {
        imageContainer.style.display = 'none';
        // Remove the winner image from the container
        imageContainer.removeChild(winnerImage);
    }, 4000); // Adjust the time (in milliseconds) as per your requirement
}


// Event listeners for player choices
rockButton.addEventListener('click', () => {
    if (!player1Choice) {
        player1Choice = 'Rock';
        turnDisplay.textContent = "Player 2's Turn";
    } else if (!player2Choice) {
        player2Choice = 'Rock';
        const winner = determineWinner(player1Choice, player2Choice);
        updateScoresAndAnnouncement(winner);
        showImage(player1Choice, player2Choice, winner);
        // Reset choices for the next round
        player1Choice = null;
        player2Choice = null;
        turnDisplay.textContent = "Player 1's Turn";
    }
});

paperButton.addEventListener('click', () => {
    if (!player1Choice) {
        player1Choice = 'Paper';
        turnDisplay.textContent = "Player 2's Turn";
    } else if (!player2Choice) {
        player2Choice = 'Paper';
        const winner = determineWinner(player1Choice, player2Choice);
        updateScoresAndAnnouncement(winner);
        showImage(player1Choice, player2Choice, winner);
        // Reset choices for the next round
        player1Choice = null;
        player2Choice = null;
        turnDisplay.textContent = "Player 1's Turn";
    }
});

scissorButton.addEventListener('click', () => {
    if (!player1Choice) {
        player1Choice = 'Scissor';
        turnDisplay.textContent = "Player 2's Turn";
    } else if (!player2Choice) {
        player2Choice = 'Scissor';
        const winner = determineWinner(player1Choice, player2Choice);
        updateScoresAndAnnouncement(winner);
        showImage(player1Choice, player2Choice, winner);
        // Reset choices for the next round
        player1Choice = null;
        player2Choice = null;
        turnDisplay.textContent = "Player 1's Turn";
    }
});

// Function to determine the winner
function determineWinner(player1Choice, player2Choice) {
    if ((player1Choice === 'Rock' && player2Choice === 'Scissor') ||
        (player1Choice === 'Paper' && player2Choice === 'Rock') ||
        (player1Choice === 'Scissor' && player2Choice === 'Paper')) {
        return 'Player 1';
    } else if ((player2Choice === 'Rock' && player1Choice === 'Scissor') ||
        (player2Choice === 'Paper' && player1Choice === 'Rock') ||
        (player2Choice === 'Scissor' && player1Choice === 'Paper')) {
        return 'Player 2';
    } else {
        return 'Tie';
    }
}

// Event listener for chat input
chatInput.addEventListener('keypress', function(e) {
    // Check if the Enter key is pressed
    if (e.key === 'Enter') {
        // Get the input value
        const message = chatInput.value.trim();

        // Clear the input field
        chatInput.value = '';

        // Display the message in the chat messages
        if (message !== '') {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            chatMessages.appendChild(messageElement);
            handleChat(); // Handle the chat after appending the message
        }
    }
});

const generateResponse = (userMessage) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
        })
    }
    // Send POST request to API, get response and set the response as paragraph text
    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            const responseMessage = data.choices[0].message.content.trim();
            const messageElement = document.createElement('div');
            messageElement.textContent = responseMessage;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTo(0, chatMessages.scrollHeight); // Scroll to the bottom of chat messages
        })
        .catch(() => {
            const errorMessageElement = document.createElement('div');
            errorMessageElement.classList.add("error");
            errorMessageElement.textContent = "Oops! Something went wrong. Please try again.";
            chatMessages.appendChild(errorMessageElement);
            chatMessages.scrollTo(0, chatMessages.scrollHeight); // Scroll to the bottom of chat messages
        });
}

const handleChat = () => {
    userMessage = chatMessages.lastElementChild.textContent; // Get the last chat message
    generateResponse(userMessage); // Generate response based on the user's message
}
