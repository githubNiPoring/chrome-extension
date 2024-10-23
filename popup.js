const sendInput = document.getElementById("send");
const textInput = document.getElementById("message");

textInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const textInputMessage = document.getElementById("message").value.trim();

    if (!textInputMessage) {
      document.getElementById("response").textContent =
        "Please enter a message.";
      return;
    }

    // Show loading message
    document.getElementById("loading").style.display = "block";
    document.getElementById("response").textContent = "";

    chrome.runtime.sendMessage(
      { type: "chat", message: textInputMessage },
      (response) => {
        // Hide loading message
        document.getElementById("loading").style.display = "none";

        if (chrome.runtime.lastError) {
          document.getElementById("response").textContent =
            "Error sending message: " +
            chrome.runtime.lastError.textInputMessage;
        } else {
          // Store the message and the response in localStorage
          const previousMessages =
            JSON.parse(localStorage.getItem("messages")) || [];
          previousMessages.push({
            prompt: textInputMessage, // User's prompt
            reply: response.reply, // Response from the chat
          });
          localStorage.setItem("messages", JSON.stringify(previousMessages));

          document.getElementById("response").textContent = response.reply;
          loadPreviousMessages(); // Reload the messages
        }
      }
    );

    document.getElementById("message").value = "";
  }
});

sendInput.addEventListener("click", () => {
  const message = document.getElementById("message").value.trim();

  if (!message) {
    document.getElementById("response").textContent = "Please enter a message.";
    return;
  }

  // Show loading message
  document.getElementById("loading").style.display = "block";
  document.getElementById("response").textContent = "";

  chrome.runtime.sendMessage({ type: "chat", message: message }, (response) => {
    // Hide loading message
    document.getElementById("loading").style.display = "none";

    if (chrome.runtime.lastError) {
      document.getElementById("response").textContent =
        "Error sending message: " + chrome.runtime.lastError.message;
    } else {
      // Store the message and the response in localStorage
      const previousMessages =
        JSON.parse(localStorage.getItem("messages")) || [];
      previousMessages.push({
        prompt: message, // User's prompt
        reply: response.reply, // Response from the chat
      });
      localStorage.setItem("messages", JSON.stringify(previousMessages));

      document.getElementById("response").textContent = response.reply;
      loadPreviousMessages(); // Reload the messages
    }
  });

  document.getElementById("message").value = "";
});

function loadPreviousMessages() {
  const previousMessagesContainer = document.getElementById("previousMessages");
  const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];

  previousMessagesContainer.innerHTML = ""; // Clear previous content

  if (storedMessages.length > 0) {
    storedMessages.forEach((messageObj) => {
      // Create a wrapper div for each prompt-response pair
      const messageWrapper = document.createElement("div");
      messageWrapper.classList.add("message-wrapper"); // Wrapper for prompt and reply

      // Create the label and div for the prompt
      const promptLabel = document.createElement("div");
      promptLabel.classList.add("message-label");
      promptLabel.textContent = "Prompt:"; // Label for the prompt

      const promptDiv = document.createElement("div");
      promptDiv.classList.add("message");
      promptDiv.textContent = messageObj.prompt; // User's message

      // Create the label and div for the response
      const replyLabel = document.createElement("div");
      replyLabel.classList.add("response-label");
      replyLabel.textContent = "Response:"; // Label for the reply

      const replyDiv = document.createElement("div");
      replyDiv.classList.add("response-message");
      replyDiv.textContent = messageObj.reply; // Response message

      // Append prompt and response to the wrapper
      messageWrapper.appendChild(promptLabel);
      messageWrapper.appendChild(promptDiv);
      messageWrapper.appendChild(replyLabel);
      messageWrapper.appendChild(replyDiv);

      // Append the wrapper to the container
      previousMessagesContainer.appendChild(messageWrapper);
    });
  } else {
    previousMessagesContainer.textContent = "No previous messages.";
  }
}

window.onload = loadPreviousMessages;

// document.getElementById("send").addEventListener("click", () => {
//   const message = document.getElementById("message").value.trim();

//   if (!message) {
//     document.getElementById("response").textContent = "Please enter a message.";
//     return;
//   }

//   // Show loading message
//   document.getElementById("loading").style.display = "block";
//   document.getElementById("response").textContent = "";

//   chrome.runtime.sendMessage({ type: "chat", message: message }, (response) => {
//     // Hide loading message
//     document.getElementById("loading").style.display = "none";

//     if (chrome.runtime.lastError) {
//       document.getElementById("response").textContent =
//         "Error sending message: " + chrome.runtime.lastError.message;
//     } else {
//       // Store the message in localStorage
//       const previousMessages =
//         JSON.parse(localStorage.getItem("messages")) || [];
//       previousMessages.push(message); // Store the sent message
//       localStorage.setItem("messages", JSON.stringify(previousMessages));

//       document.getElementById("response").textContent = response.reply;
//       loadPreviousMessages();
//     }
//   });

//   document.getElementById("message").value = "";
// });

// Function to delete all previous messages
document.getElementById("deleteMessages").addEventListener("click", () => {
  localStorage.removeItem("messages");
  document.getElementById("previousMessages").innerHTML =
    "No previous messages.";
});
