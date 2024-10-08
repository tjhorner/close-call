# `closecall.report`

[closecall.report](https://www.closecall.report) is a website where people can report near-misses (or "close calls") with vehicles while walking, rolling, cycling, or are an otherwise vulnerable road user. These anonymized reports are displayed on a public map for anyone to see.

![Screenshot of a map with clusters of points representing close call reports](https://github.com/user-attachments/assets/f634e194-8f82-43cc-98ab-d21e0cb9c5bf)

## Background

### Why?

Transportation authorities will usually keep track of road collisions and use that data to inform their decisions about where and how to improve road safety. However, there is usually no avenue for people to report near-misses, which can be just as important to identify problem areas in a road network and reach Vision Zero goals. By collecting these reports, we can identify areas where near-misses frequently happen and safety should be improved.

### How?

To spread awareness of this tool and collect the most comprehensive data possible, we've been putting stickers all across the eastside, and particularly at more dangerous intersections. We plan to compile the data into email reports that are sent to cities on a regular basis.

### Who?

This project is created and maintained by the volunteers at [Eastside Urbanism](https://eastsideurbanism.org/). If you have any feedback regarding the project, we would be glad to hear it! The best way to get in touch is by opening a GitHub issue or joining our [Discord](https://discord.com/invite/zhXKQ4vMp8).

## Development

The basis of this project is a [SvelteKit app](https://kit.svelte.dev/), so much of the development workflow is the same as any other SvelteKit app.

### Prerequisites

- Latest Node.js LTS
- Docker

### Quick Start

After cloning the repository, run the following commands to get started in your local environment:

```bash
# Install dependencies
npm install

# Copy example environment variables
cp .env.example .env

# Start supporting services (Postgres, Redis)
docker compose up -d

# Migrate the database to match schema
npm run migrate:dev

# Start the development server
npm run dev
```

Do be warned, everything is in a very bodgy state right now.

## License

MIT