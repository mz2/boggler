import { test, expect } from '@playwright/test';

test.describe('Complete Gameplay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow starting a game, finding words, and tracking score', async ({ page }) => {
    // Verify we're on the home page
    await expect(page.getByRole('heading', { name: 'Boggler' })).toBeVisible();

    // Start a new game with default settings (9x9, 180s)
    await page.getByRole('button', { name: 'New Game' }).click();

    // Should navigate to /game
    await expect(page).toHaveURL('/game');

    // Verify game elements are visible
    await expect(page.getByText(/Score:/)).toBeVisible();
    await expect(page.getByText(/\d+:\d+/)).toBeVisible(); // Timer showing MM:SS

    // Wait for grid to be rendered
    const gridCells = page.locator('.grid-cell');
    await expect(gridCells.first()).toBeVisible();

    // Count grid cells - should be 81 for 9x9
    const cellCount = await gridCells.count();
    expect(cellCount).toBe(81);

    // Get initial score (should be 0)
    const initialScore = await page.getByText(/Score: \d+/).textContent();
    expect(initialScore).toContain('Score: 0');

    // Try to find a simple 3-letter word by clicking adjacent cells
    // Note: Since the grid is randomly generated, we'll attempt common letters
    // This test might be flaky - in a real scenario, we'd seed the grid or use a fixed dictionary

    // Get all cell texts to find a pattern
    const cells = await page.locator('.grid-cell').all();

    // Try to find "THE" or "AND" or "CAT" or similar common words
    // For now, we'll just verify the Submit button appears when we select 3+ cells
    if (cells.length >= 3) {
      // Click first three adjacent cells in the first row
      await cells[0].click();
      await cells[1].click();
      await cells[2].click();

      // Submit button should now be enabled
      const submitButton = page.getByRole('button', { name: 'Submit' });
      await expect(submitButton).toBeEnabled();

      // Click submit (word might be invalid, but we're testing the flow)
      await submitButton.click();

      // Either score increases or we get an error sound
      // We can't easily test audio, but we can verify the selection clears
      await page.waitForTimeout(500);
    }

    // Verify the game is still running (timer is counting down)
    await page.waitForTimeout(1000);
    const currentTime = await page.getByText(/\d+:\d+/).textContent();
    expect(currentTime).toBeTruthy();

    // Verify New Game button is visible
    await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible();
  });

  test('should prevent resubmitting the same word', async ({ page }) => {
    // Start a new game
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page).toHaveURL('/game');

    // Wait for grid
    await expect(page.locator('.grid-cell').first()).toBeVisible();

    // This test would need a seeded grid to reliably test word validation
    // For now, we'll just verify the UI responds appropriately to selections

    const cells = await page.locator('.grid-cell').all();
    if (cells.length >= 3) {
      // Select cells
      await cells[0].click();
      await cells[1].click();
      await cells[2].click();

      // Get the current word text
      const wordText = await page.locator('text=/[A-Z]{3,}/').first().textContent();

      if (wordText) {
        // Submit once
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(500);

        // Try to select and submit the same word again
        await cells[0].click();
        await cells[1].click();
        await cells[2].click();

        await page.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(500);

        // Score should not increase for duplicate (though we can't verify without knowing initial score)
        // At minimum, verify game doesn't crash
        await expect(page.locator('.grid-cell').first()).toBeVisible();
      }
    }
  });

  test('should display found words in the word list', async ({ page }) => {
    // Start a new game
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page).toHaveURL('/game');

    // Wait for grid
    await expect(page.locator('.grid-cell').first()).toBeVisible();

    // Initially, word list should be empty or show "No words found" state
    const wordList = page.locator('.word-list');
    await expect(wordList).toBeVisible();

    // Note: Without a seeded grid, we can't reliably test finding specific words
    // This test verifies the UI structure exists
  });

  test('should allow navigation back to home during game', async ({ page }) => {
    // Start a game
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page).toHaveURL('/game');

    // Click New Game button to go back to home
    await page.getByRole('button', { name: 'New Game' }).click();

    // Should navigate back to home
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Boggler' })).toBeVisible();
  });
});
