# Feature Specification: Boggler

**Feature Branch**: `001-word-grid-game`
**Created**: 2025-11-08
**Status**: Draft
**Input**: User description: "A word game with an N x N grid (by default 9x9) where letters are shuffled into the grid and your task is to find words by connecting letters."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start New Game and Find Basic Words (Priority: P1)

A player opens the game and sees a grid filled with random letters. They locate a simple word by tracing adjacent letters with their finger or mouse, submit it, and receive immediate feedback on whether it's valid. This creates the core gameplay loop.

**Why this priority**: This is the fundamental game mechanic - without the ability to start a game and find words, there is no game. This is the minimum viable product.

**Independent Test**: Can be fully tested by launching a game, seeing a populated grid, selecting connected letters to form a valid word (e.g., "CAT"), and receiving confirmation that the word was accepted.

**Acceptance Scenarios**:

1. **Given** the player launches the game, **When** the game starts, **Then** a 9x9 grid appears filled with random letters
2. **Given** a grid is displayed, **When** the player selects adjacent letters that form a valid word, **Then** the word is highlighted and submitted for validation
3. **Given** a valid word is submitted, **When** validation completes, **Then** the player receives positive feedback (score increase, visual confirmation) and the word is marked as found
4. **Given** an invalid word is submitted, **When** validation completes, **Then** the player receives feedback that the word is not valid and can try again
5. **Given** the player has found a word, **When** they want to find another word, **Then** they can start a new selection without restarting the game

---

### User Story 2 - Time-Limited Game Session (Priority: P2)

The game runs on a timer, challenging the player to find as many words as possible before time runs out. The player can see a countdown timer during gameplay, and when time expires, the game ends and displays their final score and word count.

**Why this priority**: The time pressure is core to the game's challenge and replayability. Without it, there's no urgency or end condition. This must come before customization options but requires the basic word-finding mechanic (P1) to work first.

**Independent Test**: Can be fully tested by starting a game, observing the countdown timer, waiting for it to expire, and verifying that the game ends with a final score screen showing all found words.

**Acceptance Scenarios**:

1. **Given** a new game starts, **When** the game begins, **Then** a countdown timer is visible showing the remaining time
2. **Given** the game is in progress, **When** the player finds words, **Then** the timer continues counting down
3. **Given** the timer is running, **When** it reaches zero, **Then** the game ends and no more words can be submitted
4. **Given** the game has ended, **When** the final screen appears, **Then** it displays the final score, total words found, and the complete list of found words
5. **Given** the timer is about to expire (e.g., 10 seconds remaining), **When** the player views the interface, **Then** a visual warning indicates time is running out

---

### User Story 3 - Track Score and Found Words (Priority: P3)

During gameplay, the player can see their current score, how many words they've found, and a list of previously discovered words. This provides progression feedback and prevents duplicate submissions.

**Why this priority**: Tracking progress makes the game meaningful and engaging, but the core gameplay (P1) and timer mechanic (P2) are more fundamental.

**Independent Test**: Can be tested by finding multiple words and verifying that the score increases, the word count updates, and previously found words appear in a list and cannot be resubmitted.

**Acceptance Scenarios**:

1. **Given** a new game starts, **When** the player views the interface, **Then** the score shows 0 and the found words list is empty
2. **Given** the player finds a valid word, **When** it's accepted, **Then** the score increases based on word length and the word appears in the found words list
3. **Given** the player has found a word, **When** they try to submit the same word again, **Then** the system rejects it as already found
4. **Given** the player is playing, **When** they view the interface at any time, **Then** they can see the current score and complete list of found words

---

### User Story 4 - Customize Grid Size and Timer Duration (Priority: P4)

A player can choose different grid sizes (e.g., 4x4 for easy, 9x9 for medium, 16x16 for hard) and timer durations (e.g., 1 minute, 3 minutes, 5 minutes) before starting a new game to adjust difficulty and session length.

**Why this priority**: This adds variety and difficulty options, but the core gameplay (P1), timer mechanic (P2), and progress tracking (P3) are more fundamental.

**Independent Test**: Can be tested by selecting different grid sizes and timer durations from a menu, starting games with each combination, and verifying that the grid dimensions and countdown time match the selections.

**Acceptance Scenarios**:

1. **Given** the player is on the new game screen, **When** they view the options, **Then** they see choices for different grid sizes (small, medium, large) and timer durations
2. **Given** the player selects a 4x4 grid with a 1-minute timer, **When** the game starts, **Then** a 4x4 letter grid is displayed and the timer starts at 1:00
3. **Given** the player selects a 16x16 grid with a 5-minute timer, **When** the game starts, **Then** a 16x16 letter grid is displayed and the timer starts at 5:00
4. **Given** a game is in progress, **When** the player chooses to start a new game with different settings, **Then** the previous game ends and a new game with the selected settings begins

---

### Edge Cases

- System should ensure minimum viable word count is achievable
- When a player tries to select non-adjacent letters, the addition to selection should be rejected
- Letters can form a path crossing over themselves
- System should require minimum 3 letters for a valid word attempt
- Only complete words count towards the total score (i.e. if user is mid-word when timer expires, and hasn't attempted closing the word, they gain no points for it)
- If the player closes or refreshes the game during an active session, game session is lost (since they could be trying to cheat the timer)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate a grid of configurable size (default 9x9) filled with random letters upon game start
- **FR-002**: System MUST allow players to select adjacent letters (horizontally, vertically, or diagonally) to form words
- **FR-003**: System MUST validate submitted words against a standard dictionary of valid English words
- **FR-004**: System MUST prevent players from selecting non-adjacent letters in a single word
- **FR-005**: System MUST track and display the player's current score based on words found
- **FR-006**: System MUST maintain a list of all words found during the current game session
- **FR-007**: System MUST prevent duplicate word submissions (same word cannot be found twice in one game)
- **FR-008**: System MUST provide visual feedback when a word is selected, validated, and accepted or rejected
- **FR-009**: System MUST support grid sizes of at least 4x4, 9x9, and 16x16
- **FR-010**: System MUST calculate scores based on word length using the Fibonacci sequence (3 letters = 1pt, 4 letters = 2pts, 5 letters = 3pts, 6 letters = 5pts, etc.)
- **FR-011**: System MUST support starting a new game, which resets the grid, score, found words list, and timer
- **FR-012**: System MUST ensure letter selection forms a continuous adjacent path (crossing allowed)
- **FR-013**: System MUST display a countdown timer showing remaining time during gameplay
- **FR-014**: System MUST end the game session when the timer reaches zero
- **FR-015**: System MUST prevent any word submissions after the timer expires
- **FR-016**: System MUST display a game-over screen showing final score, total words found, and the complete list of found words when time expires
- **FR-017**: System MUST support configurable timer durations (e.g., 1 minute, 3 minutes, 5 minutes)
- **FR-018**: System MUST provide a visual warning when time is running low (e.g., last 10 seconds)

### Key Entities

- **Game Session**: Represents a single playthrough with a specific grid configuration, containing the grid state, current score, found words list, grid size setting, timer duration, and remaining time
- **Grid**: An N x N array of letters generated at game start, remains constant throughout the session
- **Word Submission**: A player's attempt to form a word, including the sequence of letter positions, the resulting string, and validation status
- **Found Word**: A validated word that has been successfully discovered, including the word text, score value, and timestamp/order of discovery
- **Letter Selection**: The current active path of letters the player is tracing, tracked as positions are added or removed
- **Game Timer**: Countdown timer that tracks remaining time, triggers game-over when expired, and provides time warnings

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can start a new game and see a populated letter grid with active countdown timer in under 2 seconds
- **SC-002**: Players can select and submit a word within 5 seconds of identifying it, with validation feedback appearing in under 1 second
- **SC-003**: 90% of valid word submissions are correctly accepted by the dictionary validation
- **SC-004**: Players can complete a full game session (finding 10+ words within the time limit) without encountering errors or system failures
- **SC-005**: The interface clearly displays current score, found words, and remaining time at all times, with updates appearing immediately after word validation
- **SC-006**: Players can switch between different grid sizes, timer durations, and start new games without confusion or errors
- **SC-007**: The timer countdown is accurate within 1 second over the duration of a game session
- **SC-008**: When the timer expires, the game ends within 1 second and displays the final results screen immediately
- **SC-009**: Players receive a clear visual warning when 10 or fewer seconds remain on the timer

## Assumptions

- The game uses a standard English dictionary for word validation
- Letters in the grid are weighted by frequency (common letters like E, A, T appear more often than Q, Z, X) to ensure playability
- Minimum word length is 3 letters (2-letter words are too numerous and may not be meaningful)
- Letter selection is done through continuous interaction (drag on touch, click-and-drag on desktop) rather than discrete clicks
- Score calculation follows the Fibonacci sequence based on word length:
  - 3 letters = 1 point
  - 4 letters = 2 points
  - 5 letters = 3 points
  - 6 letters = 5 points
  - 7 letters = 8 points
  - 8 letters = 13 points
  - 9 letters = 21 points
  - And so on following Fibonacci: F(n) where n = word_length - 2
- Found words are stored only for the current session (no persistence across game restarts unless explicitly saved)
- The game is single-player focused (no multiplayer or competitive features in this specification)
- Dictionary validation happens client-side for immediate feedback (no network delay)
- Default timer duration is 3 minutes (configurable to 1, 3, or 5 minutes)
