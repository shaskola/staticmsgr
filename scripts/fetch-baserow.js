// Required dependencies
const axios = require('axios');     // For making HTTP requests
const fs = require('fs').promises;  // For file system operations with promises
const path = require('path');       // For handling file paths
const moment = require('moment');   // For date manipulation

// API configuration
const BASEROW_URL = 'https://showcase.newhideaway.com/api/database/rows/table/787/';  // Baserow API endpoint
const CONTENT_DIR = path.join(process.cwd(), 'content', 'messages');  // Directory for markdown files

// Message type constants
const MSG_TYPE = {
    SECRET: 4753,
    SYSTEM: 4754
};

/**
 * Fetches messages from Baserow API
 * @returns {Promise<Array>} Array of message objects
 */
async function fetchMessages() {
    try {
        console.log('%c🌐 Fetching messages from Baserow', 'color: #2196F3; font-weight: bold;');
        console.log('URL:', BASEROW_URL);
        
        // Make GET request to Baserow API with authentication
        const response = await axios({
            method: 'GET',
            url: `${BASEROW_URL}?user_field_names=true`,  // Use human-readable field names
            headers: {
                'Authorization': `Token ${process.env.BASEROW_TOKEN}`  // Auth token from environment variable
            }
        });

        console.log('%c✅ API Response received', 'color: #4CAF50; font-weight: bold;', {
            totalMessages: response.data.count,
            currentPage: response.data.next ? 'Has next page' : 'Last page',
            messagesInBatch: response.data.results.length
        });

        // Log first message as sample
        if (response.data.results.length > 0) {
            console.log('%c📝 Sample message structure:', 'color: #9C27B0; font-weight: bold;', 
                response.data.results[0]
            );
        }

        return response.data.results;
    } catch (error) {
        console.error('%c❌ Error fetching messages:', 'color: #f44336; font-weight: bold;', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });
        return [];
    }
}

/**
 * Creates markdown content from a message object
 * @param {Object} message - Message object from Baserow
 * @returns {string|null} Markdown content or null if invalid
 */
function createMarkdownContent(message) {
    // Get username from nickname or fall back to characterlink
    const username = message.nickname?.[0]?.value || message.characterlink?.[0]?.value;
    
    console.log('%c📄 Processing message:', 'color: #FF9800; font-weight: bold;', {
        ID: message.ID,
        hasDate: !!message['Send-Date'],
        hasMessage: !!message.message,
        msgType: message.msgType,
        username: {
            final: username,
            fromNickname: message.nickname?.[0]?.value,
            fromCharacterlink: message.characterlink?.[0]?.value
        },
        avatar: message.avatar,
        buttons: {
            button1: message['button 1 text'],
            button2: message['button 2 text'],
            button3: message['button 3 text']
        }
    });

    // Validate and format the date
    const sendDate = message['Send-Date'];
    if (!sendDate) {
        console.error('%c❌ No Send-Date found for message:', 'color: #f44336; font-weight: bold;', message.ID);
        return null;
    }
    
    // Parse and validate the date
    const parsedDate = moment(sendDate);
    if (!parsedDate.isValid()) {
        console.error('%c❌ Invalid date for message:', 'color: #f44336; font-weight: bold;', {
            ID: message.ID,
            date: sendDate,
            error: 'Date must be in ISO format'
        });
        return null;
    }

    // Ensure date is in ISO format: YYYY-MM-DDTHH:mm:ss.SSSZ
    const formattedDate = parsedDate.toISOString();

    // Log date processing
    console.log('%c📅 Date Processing:', 'color: #2196F3; font-weight: bold;', {
        original: sendDate,
        parsed: parsedDate.format(),
        formatted: formattedDate,
        isValid: parsedDate.isValid(),
        utcOffset: parsedDate.utcOffset()
    });

    // Get message type ID for determining message category
    const msgTypeId = message.msgType?.id || 0;
    
    // Process message content
    let messageContent = message.message || '';
    // Convert to uppercase if it's a secret message
    if (msgTypeId === MSG_TYPE.SECRET) {
        messageContent = messageContent.toUpperCase();
        console.log('%c🔒 Secret message converted to uppercase:', 'color: #9C27B0; font-weight: bold;', {
            original: message.message,
            converted: messageContent
        });
    }
    
    // Log message details for debugging
    console.log('%c📋 Message details:', 'color: #607D8B; font-weight: bold;', {
        ID: message.ID,
        date: formattedDate,
        type: msgTypeId === MSG_TYPE.SECRET ? 'secret' : 
              msgTypeId === MSG_TYPE.SYSTEM ? 'system' : 'regular',
        msgTypeId,
        username: {
            value: username,
            source: message.nickname?.[0]?.value ? 'nickname' : 'characterlink'
        }
    });

    // Create frontmatter array with message metadata
    const frontmatter = [
        '---',
        `title: "${message.ID}"`,
        `date: ${formattedDate}`,
        // Always include msgType in frontmatter
        `msgType: ${msgTypeId}`,
        // Message type (system: 4754, secret: 4753)
        msgTypeId === MSG_TYPE.SYSTEM ? 'type: "system"' : '',
        msgTypeId === MSG_TYPE.SECRET ? 'type: "secret"' : '',
        // Use nickname with fallback to characterlink for username
        username ? `username: "${username}"` : '',
        message.avatar?.[0]?.url ? `avatar: "${message.avatar[0].url}"` : '',
        message.Image?.[0]?.url ? `msgimage: "${message.Image[0].url}"` : '',
        message['button 1 text'] ? `button1: "${message['button 1 text']}"` : '',
        message['button 2 text'] ? `button2: "${message['button 2 text']}"` : '',
        message['button 3 text'] ? `button3: "${message['button 3 text']}"` : '',
        '---',
        '',
        messageContent  // Use the processed message content
    ].filter(Boolean).join('\n');  // Remove empty lines and join

    console.log('%c📑 Generated frontmatter for message:', 'color: #009688; font-weight: bold;', {
        ID: message.ID,
        username: {
            value: username,
            source: message.nickname?.[0]?.value ? 'nickname' : 'characterlink'
        }
    });
    return frontmatter;
}

/**
 * Ensures the content directory exists
 * @returns {Promise<void>}
 */
async function ensureContentDirectory() {
    try {
        const dir = path.resolve(CONTENT_DIR);
        console.log('%c📁 Creating directory:', 'color: #795548; font-weight: bold;', dir);
        await fs.mkdir(CONTENT_DIR, { recursive: true });  // Create directory if it doesn't exist
        console.log('%c✅ Directory ready:', 'color: #4CAF50; font-weight: bold;', dir);
    } catch (error) {
        if (error.code !== 'EEXIST') {  // Ignore "already exists" error
            console.error('%c❌ Error creating directory:', 'color: #f44336; font-weight: bold;', {
                code: error.code,
                message: error.message,
                path: error.path
            });
            throw error;
        }
    }
}

/**
 * Writes a message to a markdown file
 * @param {Object} message - Message object from Baserow
 * @returns {Promise<void>}
 */
async function writeMessageFile(message) {
    console.log('%c💾 Writing message:', 'color: #3F51B5; font-weight: bold;', message.ID);
    
    const content = createMarkdownContent(message);
    if (!content) {
        console.error('%c❌ Failed to create content for message:', 'color: #f44336; font-weight: bold;', message.ID);
        return;
    }

    // Create filename based on message type
    const msgTypeId = message.msgType?.id || 0;
    const filename = `${String(message.ID).padStart(5, '0')}-${  // Pad ID with zeros
        msgTypeId === MSG_TYPE.SYSTEM ? 'system' : 
        msgTypeId === MSG_TYPE.SECRET ? 'secret' : 
        'message'
    }.md`;
    const filepath = path.join(CONTENT_DIR, filename);
    
    console.log('%c📝 File details:', 'color: #673AB7; font-weight: bold;', {
        filename,
        filepath,
        contentLength: content.length,
        messageType: msgTypeId === MSG_TYPE.SYSTEM ? 'system' : 
                    msgTypeId === MSG_TYPE.SECRET ? 'secret' : 'regular'
    });

    // Write the file
    try {
        await fs.writeFile(filepath, content, 'utf8');
        console.log('%c✅ Successfully written file:', 'color: #4CAF50; font-weight: bold;', filename);
    } catch (error) {
        console.error('%c❌ Error writing file:', 'color: #f44336; font-weight: bold;', {
            filename,
            error: error.message,
            code: error.code
        });
    }
}

/**
 * Main function to orchestrate the content update process
 * 1. Creates content directory if needed
 * 2. Fetches messages from Baserow
 * 3. Clears existing content
 * 4. Writes new content files
 */
async function main() {
    try {
        console.log('%c🚀 Starting content update process...', 'color: #E91E63; font-size: 14px; font-weight: bold;');
        console.log('%c📂 Working directory:', 'color: #795548; font-weight: bold;', process.cwd());
        
        // Ensure content directory exists
        await ensureContentDirectory();
        
        // Fetch messages from Baserow
        const messages = await fetchMessages();
        console.log('%c📊 Fetched messages:', 'color: #2196F3; font-weight: bold;', messages.length);
        
        // Clear existing content
        const files = await fs.readdir(CONTENT_DIR);
        console.log('%c🗑️ Clearing existing files:', 'color: #FF5722; font-weight: bold;', files);
        
        await Promise.all(files.map(file => {
            const filepath = path.join(CONTENT_DIR, file);
            console.log('%c🗑️ Deleting:', 'color: #FF5722; font-weight: bold;', filepath);
            return fs.unlink(filepath);
        }));
        console.log('%c✅ Cleared existing files', 'color: #4CAF50; font-weight: bold;');

        // Write new content files
        console.log('%c📝 Writing new content files...', 'color: #009688; font-weight: bold;');
        await Promise.all(messages.map(writeMessageFile));
        
        console.log('%c✨ Successfully processed all messages', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
    } catch (error) {
        console.error('%c💥 Error in main process:', 'color: #f44336; font-size: 14px; font-weight: bold;', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        process.exit(1);  // Exit with error code
    }
}

// Run the script
console.log('%c🎬 Starting script execution', 'color: #E91E63; font-size: 16px; font-weight: bold;');
main(); 