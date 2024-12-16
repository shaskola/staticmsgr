// Required dependencies
const axios = require('axios');     // For making HTTP requests
const fs = require('fs').promises;  // For file system operations with promises
const path = require('path');       // For handling file paths
const moment = require('moment');   // For date manipulation

// API configuration
const BASEROW_URL = 'https://showcase.newhideaway.com/api/database/rows/table/787/';  // Baserow API endpoint
const CONTENT_DIR = path.join(process.cwd(), 'content', 'messages');  // Directory for markdown files
const LOG_FILE = path.join(process.cwd(), 'content', '_debug.md');  // Log file path

// Message type constants
const MSG_TYPE = {
    SECRET: 4753,
    SYSTEM: 4754
};

// Custom logger that writes to both console and file
const logger = {
    logs: [],
    log(...args) {
        const msg = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ');
        console.log(...args);
        this.logs.push(`[LOG] ${msg}`);
    },
    error(...args) {
        const msg = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ');
        console.error(...args);
        this.logs.push(`[ERROR] ${msg}`);
    },
    async saveToFile() {
        const content = [
            '---',
            'title: "Debug Log"',
            'date: ' + new Date().toISOString(),
            '---',
            '',
            '# Debug Log',
            '',
            'This file contains debug information from the last content update.',
            '',
            '## Logs',
            '',
            ...this.logs
        ].join('\n');

        await fs.writeFile(LOG_FILE, content, 'utf8');
    }
};

/**
 * Fetches messages from Baserow API
 * @returns {Promise<Array>} Array of message objects
 */
async function fetchMessages() {
    try {
        logger.log('Fetching messages from:', BASEROW_URL);
        
        // Make GET request to Baserow API with authentication
        const response = await axios({
            method: 'GET',
            url: `${BASEROW_URL}?user_field_names=true`,  // Use human-readable field names
            headers: {
                'Authorization': `Token ${process.env.BASEROW_TOKEN}`  // Auth token from environment variable
            }
        });

        logger.log('API Response:', {
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            resultsCount: response.data.results.length
        });

        // Log first message as sample
        if (response.data.results.length > 0) {
            logger.log('Sample message structure:', JSON.stringify(response.data.results[0], null, 2));
        }

        return response.data.results;
    } catch (error) {
        logger.error('Error fetching messages:', {
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
    logger.log('Creating markdown for message:', {
        ID: message.ID,
        hasDate: !!message['Send-Date'],
        hasMessage: !!message.message,
        msgType: message.msgType,
        characterlink: message.characterlink,
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
        logger.error('No Send-Date found for message:', message.ID);
        return null;
    }
    
    // Parse and validate the date
    const parsedDate = moment(sendDate);
    if (!parsedDate.isValid()) {
        logger.error('Invalid date for message:', message.ID, 'Date:', sendDate);
        return null;
    }

    // Format date as: 2024-01-20T15:30:00Z
    const formattedDate = parsedDate.format('YYYY-MM-DD[T]HH:mm:ss[Z]');

    // Get message type ID for determining message category
    const msgTypeId = message.msgType?.id || 0;
    
    // Log message details for debugging
    logger.log('Processing message:', {
        ID: message.ID,
        date: formattedDate,
        type: msgTypeId === MSG_TYPE.SECRET ? 'secret' : 
              msgTypeId === MSG_TYPE.SYSTEM ? 'system' : 'regular',
        msgTypeId
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
        // Optional fields with null coalescing
        message.characterlink?.[0]?.value ? `username: "${message.characterlink[0].value}"` : '',
        message.avatar?.[0]?.url ? `avatar: "${message.avatar[0].url}"` : '',
        message.Image?.[0]?.url ? `msgimage: "${message.Image[0].url}"` : '',
        message['button 1 text'] ? `button1: "${message['button 1 text']}"` : '',
        message['button 2 text'] ? `button2: "${message['button 2 text']}"` : '',
        message['button 3 text'] ? `button3: "${message['button 3 text']}"` : '',
        '---',
        '',
        message.message || ''  // Message content
    ].filter(Boolean).join('\n');  // Remove empty lines and join

    logger.log('Generated frontmatter:', frontmatter);
    return frontmatter;
}

/**
 * Ensures the content directory exists
 * @returns {Promise<void>}
 */
async function ensureContentDirectory() {
    try {
        const dir = path.resolve(CONTENT_DIR);
        logger.log('Ensuring directory exists:', dir);
        await fs.mkdir(CONTENT_DIR, { recursive: true });  // Create directory if it doesn't exist
        logger.log('Directory ready:', dir);
    } catch (error) {
        if (error.code !== 'EEXIST') {  // Ignore "already exists" error
            logger.error('Error creating directory:', {
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
    logger.log('Writing message file for ID:', message.ID);
    
    const content = createMarkdownContent(message);
    if (!content) {
        logger.error('Failed to create content for message:', message.ID);
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
    
    logger.log('Writing file:', {
        filename,
        filepath,
        contentLength: content.length,
        messageType: msgTypeId === MSG_TYPE.SYSTEM ? 'system' : 
                    msgTypeId === MSG_TYPE.SECRET ? 'secret' : 'regular'
    });

    // Write the file
    try {
        await fs.writeFile(filepath, content, 'utf8');
        logger.log('Successfully written file:', filename);
    } catch (error) {
        logger.error('Error writing file:', {
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
        logger.log('Starting content update process...');
        logger.log('Current working directory:', process.cwd());
        
        // Ensure content directory exists
        await ensureContentDirectory();
        logger.log('Content directory ready');
        
        // Fetch messages from Baserow
        const messages = await fetchMessages();
        logger.log(`Fetched ${messages.length} messages from Baserow`);
        
        // Clear existing content
        const files = await fs.readdir(CONTENT_DIR);
        logger.log('Found existing files:', files);
        
        await Promise.all(files.map(file => {
            const filepath = path.join(CONTENT_DIR, file);
            logger.log('Deleting file:', filepath);
            return fs.unlink(filepath);
        }));
        logger.log('Cleared existing content files');

        // Write new content files
        logger.log('Starting to write new content files...');
        await Promise.all(messages.map(writeMessageFile));
        
        logger.log(`Successfully processed ${messages.length} messages`);

        // Save logs to file
        await logger.saveToFile();
    } catch (error) {
        logger.error('Error in main process:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        
        // Try to save logs even if there was an error
        try {
            await logger.saveToFile();
        } catch (e) {
            console.error('Failed to save logs:', e);
        }
        
        process.exit(1);  // Exit with error code
    }
}

// Run the script
main(); 