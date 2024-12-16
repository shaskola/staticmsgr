const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const moment = require('moment');

const BASEROW_URL = 'https://showcase.newhideaway.com/api/database/rows/table/736/';
const CONTENT_DIR = path.join(process.cwd(), 'content', 'messages');

async function fetchMessages() {
    try {
        const response = await axios({
            method: 'GET',
            url: `${BASEROW_URL}?user_field_names=true`,
            headers: {
                'Authorization': `Token ${process.env.BASEROW_TOKEN}`
            }
        });

        return response.data.results;
    } catch (error) {
        console.error('Error fetching messages:', error.message);
        return [];
    }
}

function createMarkdownContent(message) {
    // Validate and format the date
    const sendDate = message['Send-Date'];
    if (!sendDate) {
        console.error('No Send-Date found for message:', message.ID);
        return null;
    }
    
    const parsedDate = moment(sendDate);
    if (!parsedDate.isValid()) {
        console.error('Invalid date for message:', message.ID, 'Date:', sendDate);
        return null;
    }

    // Format date as: 2024-01-20T15:30:00-07:00
    const formattedDate = parsedDate.format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    console.log('Formatted date:', formattedDate, 'for message:', message.ID);

    const frontmatter = [
        '---',
        `title: "${message.ID}"`,
        `date: ${formattedDate}`,
        message.msgType?.id === 4727 ? 'type: "system"' : '',
        message.msgType?.id === 4728 ? 'type: "secret"' : '',
        message.character?.[0]?.value ? `username: "${message.character[0].value}"` : '',
        message.avatar?.[0]?.url ? `avatar: "${message.avatar[0].url}"` : '',
        message.Image?.[0]?.url ? `msgimage: "${message.Image[0].url}"` : '',
        message['button 1 text'] ? `button1: "${message['button 1 text']}"` : '',
        message['button 2 text'] ? `button2: "${message['button 2 text']}"` : '',
        message['button 3 text'] ? `button3: "${message['button 3 text']}"` : '',
        '---',
        '',
        message.message || ''
    ].filter(Boolean).join('\n');

    return frontmatter;
}

async function ensureContentDirectory() {
    try {
        await fs.mkdir(CONTENT_DIR, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

async function writeMessageFile(message) {
    const content = createMarkdownContent(message);
    if (!content) {
        console.error('Failed to create content for message:', message.ID);
        return;
    }

    const filename = `${String(message.ID).padStart(5, '0')}-${
        message.msgType?.id === 4727 ? 'system' : 
        message.msgType?.id === 4728 ? 'secret' : 
        'message'
    }.md`;
    const filepath = path.join(CONTENT_DIR, filename);
    
    await fs.writeFile(filepath, content, 'utf8');
    console.log('Written file:', filename);
}

async function main() {
    try {
        await ensureContentDirectory();
        const messages = await fetchMessages();
        
        // Clear existing content
        const files = await fs.readdir(CONTENT_DIR);
        await Promise.all(files.map(file => 
            fs.unlink(path.join(CONTENT_DIR, file))
        ));

        // Write new content
        await Promise.all(messages.map(writeMessageFile));
        
        console.log(`Successfully processed ${messages.length} messages`);
    } catch (error) {
        console.error('Error in main process:', error);
        process.exit(1);
    }
}

main(); 