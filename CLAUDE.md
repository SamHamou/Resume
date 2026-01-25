# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo static site for the Finchley Horticultural Society, a gardening community in North London. The site uses a custom theme called `fhs-simple` and serves content about the society, their allotments, events, newsletters, and membership information.

## Development Commands

- **Build site**: `hugo`
- **Serve locally**: `hugo server` or `hugo serve`
- **Build for production**: `hugo --minify`
- **Clean build cache**: `hugo mod clean`

## Architecture

### Theme Structure
- Custom theme located in `themes/fhs-simple/`
- Uses Pico CSS framework (classless) for styling
- Base template: `themes/fhs-simple/layouts/baseof.html`
- Custom CSS in `themes/fhs-simple/static/css/main.css`

### Content Organization
- **Content types**: Standard pages, events (with date-based permalinks), newsletters
- **Events**: Use permalink structure `/events/:year/:month/:title/` 
- **Data files**: Newsletter archive stored in `data/newsletters.json`
- **Menu**: Configured in `hugo.toml` with weighted navigation items

### Key Features
- **Newsletter archive**: Custom shortcode `{{< newsletter-archive >}}` displays tabular archive from `data/newsletters.json`
- **Events**: Date-based organization with custom layouts
- **Static assets**: CSS and other static files served from theme's static directory

### Configuration
- Main config: `hugo.toml`
- Site uses GB English locale (`en-gb`)
- Goldmark renderer with unsafe HTML enabled
- Custom taxonomies for categories and tags

## Content Management

### Adding Events
Events are markdown files in `content/events/` with frontmatter including date, title, and content. They automatically organize by year/month based on permalinks configuration.

### Newsletter Updates
Update the newsletter archive by editing `data/newsletters.json` with new entries following the existing structure (year, season, title, URL).

### Styling
The site uses Pico CSS (classless) as base styling with custom overrides in `main.css`. Changes to appearance should be made in the theme's static CSS files.

## DO NOT DO THE FOLLOWING

-  Run Hugo commands
-  Run git commands