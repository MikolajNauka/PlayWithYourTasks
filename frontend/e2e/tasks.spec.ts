import { test, expect } from '@playwright/test';

test.describe('E2E: Pełny scenariusz użytkownika w PlayWithYourTasks', () => {
  test('Powinien załadować stronę, dodać zadanie, zmienić stan na ukończone i sprawdzić grywalizację', async ({
    page,
  }) => {
    // 1. Otwarcie strony głównej
    await page.goto('/');

    // 2. Weryfikacja nagłówka i komponentu grywalizacji
    await expect(page.locator('text=PlayWithYourTasks').first()).toBeVisible();
    await expect(page.getByTestId('gamification-bar')).toBeVisible();

    // 3. Otwarcie modalu dodawania zadania
    await page.getByTestId('button-add-task').click();
    await expect(page.getByTestId('add-task-modal')).toBeVisible();

    // 4. Wypełnienie formularza
    const uniqueTitle = `Projekt Inżynierski E2E ${Date.now()}`;
    await page.getByTestId('input-task-title').fill(uniqueTitle);
    await page.getByTestId('input-task-description').fill('Opis wygenerowany przez test automatyczny Playwright');
    await page.getByTestId('select-task-priority').selectOption('high');
    await page.getByTestId('input-task-category').fill('E2E Test');

    // 5. Wysłanie formularza
    await page.getByTestId('modal-submit-button').click();

    // 6. Weryfikacja, czy zadanie pojawiło się na liście
    const taskTitleLocator = page.locator(`text=${uniqueTitle}`);
    await expect(taskTitleLocator).toBeVisible({ timeout: 5000 });

    // 7. Kliknięcie ukończenia zadania
    const taskItem = page.locator(`div:has-text("${uniqueTitle}")`).first();
    const toggleButton = taskItem.locator('button[data-testid^="task-toggle-"]').first();
    await toggleButton.click();

    // 8. Weryfikacja przefiltrowania
    await page.getByTestId('filter-completed').click();
    await expect(taskTitleLocator).toBeVisible();

    // 9. Przełączenie na aktywne (nie powinno go być)
    await page.getByTestId('filter-active').click();
    await expect(taskTitleLocator).not.toBeVisible();

    // 10. Powrót do wszystkich i usunięcie zadania
    await page.getByTestId('filter-all').click();
    const deleteButton = taskItem.locator('button[data-testid^="task-delete-"]').first();
    await deleteButton.click({ force: true });
  });
});
