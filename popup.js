function loadPreviousMessages() {
    const previousMessagesContainer = document.getElementById('previousMessages');
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    
    if (storedMessages.length > 0) {
        previousMessagesContainer.innerHTML = '<strong>Previous Messages:</strong><br>' + storedMessages.join('<br>');
    } else {
        previousMessagesContainer.textContent = 'No previous messages.';
    }
}

window.onload = loadPreviousMessages;

document.getElementById('send').addEventListener('click', () => {
    const message = document.getElementById('message').value.trim();

    if (!message) {
        document.getElementById('response').textContent = 'Please enter a message.';
        return;
    }

    // Show loading message
    document.getElementById('loading').style.display = 'block';
    document.getElementById('response').textContent = '';

    chrome.runtime.sendMessage({ type: 'chat', message: message }, (response) => {
        // Hide loading message
        document.getElementById('loading').style.display = 'none';

        if (chrome.runtime.lastError) {
            document.getElementById('response').textContent = 'Error sending message: ' + chrome.runtime.lastError.message;
        } else {
            // Store the message in localStorage
            const previousMessages = JSON.parse(localStorage.getItem('messages')) || [];
            previousMessages.push(message); // Store the sent message
            localStorage.setItem('messages', JSON.stringify(previousMessages));
            
            document.getElementById('response').textContent = response.reply;
            loadPreviousMessages();
        }
    });

    document.getElementById('message').value = '';
});

// Function to delete all previous messages
document.getElementById('deleteMessages').addEventListener('click', () => {
    localStorage.removeItem('messages');
    document.getElementById('previousMessages').innerHTML = 'No previous messages.';
});
