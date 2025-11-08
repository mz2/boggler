import { test, expect } from '@playwright/test';

test.describe('Game Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow selecting different grid sizes', async ({ page }) => {
    // Verify we're on home page
    await expect(page.getByRole('heading', { name: 'Boggler' })).toBeVisible();

    // Find the grid size selector
    const gridSizeSelect = page.locator('select[name="gridSize"]');
    await expect(gridSizeSelect).toBeVisible();

    // Select 4x4 grid
    await gridSizeSelect.selectOption('4');

    // Start game
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page).toHaveURL('/game');

    // Verify grid has 16 cells (4x4)
    const cells = page.locator('.grid-cell');
    await expect(cells.first()).toBeVisible();

    const cellCount = await cells.count();
    expect(cellCount).toBe(16);
  });

  test('should allow selecting different timer durations', async ({ page }) => {
    // Find the timer duration selector
    const timerSelect = page.locator('select[name="timerDuration"]');
    await expect(timerSelect).toBeVisible();

    // Select 1 minute (60 seconds)
    await timerSelect.selectOption('60');

    // Start game
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page).toHaveURL('/game');

    // Verify timer shows approximately 1:00
    const timer = page.getByText(/\d+:\d+/);
    await expect(timer).toBeVisible();

    const timerText = await timer.textContent();
    expect(timerText).toMatch(/^[01]:[0-5]\d$/);

    // Initial time should be around 1:00 or 0:59
    const [minutes] = timerText!.split(':').map(Number);
    expect(minutes).toBeLessThanOrEqual(1);
  });

  test('should start game with 9x9 grid and 3 minutes by default', async ({ page }) => {
    // Start game without changing settings
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page).toHaveURL('/game');

    // Verify grid has 81 cells (9x9)
    const cells = page.locator('.grid-cell');
    await expect(cells.first()).toBeVisible();

    const cellCount = await cells.count();
    expect(cellCount).toBe(81);

    // Verify timer shows approximately 3:00
    const timer = page.getByText(/\d+:\d+/);
    await expect(timer).toBeVisible();

    const timerText = await timer.textContent();
    expect(timerText).toMatch(/^[0-3]:[0-5]\d$/);

    const [minutes] = timerText!.split(':').map(Number);
    expect(minutes).toBeGreaterThanOrEqual(2);
    expect(minutes).toBeLessThanOrEqual(3);
  });

  test('should allow selecting 16x16 grid', async ({ page }) => {
    // Select 16x16 grid
    const gridSizeSelect = page.locator('select[name="gridSize"]');
    await gridSizeSelect.selectOption('16');

    // Start game
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page).toHaveURL('/game');

    // Verify grid has 256 cells (16x16)
    const cells = page.locator('.grid-cell');
    await expect(cells.first()).toBeVisible();

    const cellCount = await cells.count();
    expect(cellCount).toBe(256);
  });

  test('should allow selecting 5 minute timer', async ({ page }) => {
    // Select 5 minutes (300 seconds)
    const timerSelect = page.locator('select[name="timerDuration"]');
    await timerSelect.selectOption('300');

    // Start game
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page).toHaveURL('/game');

    // Verify timer shows approximately 5:00
    const timer = page.getByText(/\d+:\d+/);
    await expect(timer).toBeVisible();

    const timerText = await timer.textContent();
    const [minutes] = timerText!.split(':').map(Number);

    expect(minutes).toBeGreaterThanOrEqual(4);
    expect(minutes).toBeLessThanOrEqual(5);
  });

  test('should preserve settings when returning to home', async ({ page }) => {
    // Change settings
    const gridSizeSelect = page.locator('select[name="gridSize"]');
    const timerSelect = page.locator('select[name="timerDuration"]');

    await gridSizeSelect.selectOption('16');
    await timerSelect.selectOption('300');

    // Start game
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page).toHaveURL('/game');

    // Go back to home
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page).toHaveURL('/');

    // Verify settings are still selected
    const gridValue = await gridSizeSelect.inputValue();
    const timerValue = await timerSelect.inputValue();

    expect(gridValue).toBe('16');
    expect(timerValue).toBe('300');
  });
});
