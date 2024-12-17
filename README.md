# Static Messenger

A static messaging application built with Hugo that integrates with a Baserow database backend. This project allows you to create and manage message-based interactions with customizable characters.

## Features

- Static site generation using Hugo
- Integration with Baserow database API
- Character-based messaging system
- Support for various message types (secret/system)
- Customizable message buttons
- Image attachment support
- Avatar management for characters

## Tech Stack

- Frontend: Hugo Static Site Generator
- Backend: Baserow Database API
- Hosting: GitHub Pages
- Content: Markdown with HTML support

## Project Structure

```
staticmsgr/
├── archetypes/     # Hugo content templates
├── content/        # Markdown content files
├── public/         # Generated static site
├── scripts/        # Utility scripts
├── static/         # Static assets
├── themes/         # Hugo themes
└── hugo.toml       # Hugo configuration
```

## API Features

### Messages
- Create, read, update, and delete messages
- Support for text content and image attachments
- Customizable button configurations
- Message type classification (secret/system)
- Automatic date tracking

### Characters
- Character management with names and nicknames
- Avatar image support
- Message count tracking
- Character-message linking

## Setup

1. Clone the repository
2. Install Hugo (extended version)
3. Configure your Baserow database token
4. Run the development server:
   ```bash
   hugo server -D
   ```

## Building and Deployment

To build the site for production:
```bash
hugo
```

The site will be generated in the `public/` directory, ready for deployment to GitHub Pages or any other static hosting service.

## Configuration

Edit `hugo.toml` to customize your site settings:
- Base URL
- Site title
- Theme settings
- Output formats

## API Authentication

The application requires a Baserow database token for API access. Set up your authentication token in the appropriate configuration file before deploying.

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here] 