function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Check if the request is for a directory (ends with /)
    if (uri.endsWith('/')) {
        // Add index.html to the end
        request.uri = uri + 'index.html';
    }
    // Check if the request doesn't have a file extension
    else if (!uri.includes('.')) {
        // Add .html extension
        request.uri = uri + '.html';
    }
    
    return request;
} 