# Changelog

## [1.2.1] - [1.0.5] - 2025-09-25
### Added
- Added health model to database, the health page now saves the data also in database.

### Changed
- Updated the locales files with new keys and translations.
- Updated npm dependencies version to the newest.

### Fixed
- Fixed the bug while the language selector was not working.
- Fixed the type error during npm dependencies update.

## [1.2.0] - [1.0.4] - 2025-09-15
### Added
- Added a health page that displays health data visualizations and evaluations.
- Added a button in the user form to navigate to the health page.
- The user can now input daily their health data (pulse, blood pressure, steps, and a comment) and get a health score based on the data.

### Changed

### Fixed

## [1.1.8] - [1.0.4] - 2025-09-05
### Added
- Implemented an auth system, allowing users to register and log in, and save the data more easily.
- The user can now delete their account from the settings modal.
- The user can log out from the settings modal.

### Changed
- Changed the CORS settings in the server to allow credentials and restrict origin.
- Updated the .env.example file with the new API keys and URLs.

### Fixed

## [1.1.7] - [1.0.3] - 2025-07-21
**Hotfix** for issues in the [1.1.6] update.
### Added
- Added new AI model: Kimi K2, which is an OpenRouter model.

### Changed

### Fixed
- Fixed the chat, now the AI answers the question.

## [1.1.6] - [1.0.3] - 2025-07-18
### Added
- Added new AI model: Dr. Sanovise, which is a Hugging Face model. (test only)

### Changed
- The scroll up/down buttons has been reversed.
- Updated the .env.example file with a new OpenAI API key and Discord webhook URL.

### Fixed
- Now answers at the selected language.
- If the answer failes, you can retry without reloading the page.

## [1.1.5] - [1.0.2] - 2025-07-01
### Added

### Changed
- Scroll up/down buttons are now icons instead of emojis.
- The response stop button now moved to the chat interface at the sending place.

### Fixed
- Fixed a problem with the req.ip, now works how is should.

## [1.1.4] - [1.0.1] - 2025-07-01
### Added
- Added Discord logging for debugging purposes.

### Changed
- Main language changed from Hungarian to English.
- Removed `npm start2` script from the server package.json.

### Fixed
- Fixed some unhandled errors.

## [1.1.3] - [1.0.0] - 2025-06-27
### Added
- **SettingsModal**: Added a version display in the settings modal.

### Changed
- **i18n**: Added a new key for the version in the settings modal.
- **ChatInterface**: Changed the scroll up/down button from center to right side.
- **Response**: Removed animation from the streamed reponse.

## [1.1.4] - [1.0.0] - 2025-06-30
### Added

### Changed
- **i18n**: Updated the i18n keys for every language.

### Fixed
- **i18n**: Fixed the problem with non-reactive locales.

## [1.1.3] - [1.0.0] - 2025-06-27
### Added
- **SettingsModal**: Added a version display in the settings modal.

### Changed
- **i18n**: Added a new key for the version in the settings modal.
- **ChatInterface**: Changed the scroll up/down button from center to right side.
- **Response**: Removed animation from the streamed reponse.

### Fixed

## [1.1.2] - 2025-04-27
**Hotfix** for issues in the [1.1.1] update.

### Added

### Changed

### Fixed
- Changed the NewsAPI to Guardian API, NewsAPI only works with localhost.

## [1.1.1] - 2025-04-27
All changes are in the **Landing Page**.

### Added
- New features added to the terms section.
- Display of news articles on the homepage.
- New elements added to the homepage.

### Changed
- **App**: Centered and resized the scroll-up and scroll-down buttons.
- Style improvements.

### Fixed
- Fixed i18n type error during iteration.

## [1.1.0] - 2025-04-26
### Added
- Added support for 3 new languages: Romanian, Italian, and Polish.
- Option to toggle visibility of the form and chat interface.
- AI model selection available.
- New input fields were added to the form for better user experience.

### Changed
- New styles added in several places, including a rounder chat design and repositioned elements.

### Fixed

## [1.0.0] - 2025-04-22
### Added
- Many languages available.

### Changed

### Fixed