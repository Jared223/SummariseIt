document.getElementById('summarize-form').addEventListener('submit', function(event) {
    event.preventDefault(); // stop the form from submitting normally
    var url = document.getElementById('url-input').value;
    if (isValidUrl(url)) {
        getSummary(url);
    } else {
        showError("Invalid URL. Please enter a valid URL.");
    }
});

function isValidUrl(url) {
    var urlPattern = /^http[s]?:\/\/.+/; // very basic URL validation
    return urlPattern.test(url);
}

async function getSummary(url) {
    showLoader();
    // AJAX request to back end
    try {
        const response = await fetch('http://localhost:3000/backend/summarise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        });

        if (!response.ok) {
            throw new Error('Failed to summarise document');
        }

        const summary = await response.json();

        // Display the summary on the page
        document.getElementById('summary-output').innerHTML = summary.sentences.join(' ');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
    }
}

function showError(message) {
    var errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerHTML = message;
    errorMessageElement.classList.remove('hidden');
}

function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}
