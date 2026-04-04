import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

  console.log('Opening app root...');
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });

  console.log('Setting localStorage: user, tasks, language, theme');
  await page.evaluate(() => {
    const now = new Date();
    const user = { id: 1, username: 'admin', email: 'admin@example.com', password: '123456', createdAt: new Date().toISOString() };
    localStorage.setItem('users', JSON.stringify([user]));
    localStorage.setItem('currentUser', JSON.stringify(user));

    const dateISO = new Date().toISOString();
    const tasks = [{
      id: 9999,
      userId: 1,
      title: 'Tarea de prueba E2E',
      description: 'Creada por test automático',
      date: dateISO,
      priority: 'Alta',
      completed: false,
      status: 'Pendiente',
      createdAt: dateISO,
      updatedAt: dateISO
    }];
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('app_language', 'es');
    localStorage.setItem('app_theme', 'default');
  });

  await page.reload({ waitUntil: 'networkidle' });

  console.log('Navigate to /calendario');
  await page.goto('http://localhost:4200/calendario', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const h2 = await page.locator('h2').first().innerText().catch(() => '');
  const taskCount = await page.locator('text=Tarea de prueba E2E').count();
  await page.screenshot({ path: 'tests/screenshot_calendario_es.png', fullPage: true });

  console.log('Switching language -> en via localStorage + reload');
  await page.evaluate(() => localStorage.setItem('app_language', 'en'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.goto('http://localhost:4200/lista-tareas', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const titleText = await page.locator('ion-title, h1, h2').first().innerText().catch(() => '');
  await page.screenshot({ path: 'tests/screenshot_lista_en.png', fullPage: true });

  console.log('Switching theme -> green via localStorage + reload');
  await page.evaluate(() => localStorage.setItem('app_theme', 'green'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ion-background-color'));
  const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary'));
  await page.screenshot({ path: 'tests/screenshot_theme_green.png', fullPage: true });

  console.log(JSON.stringify({ h2, taskCount, titleText, bg: bg.trim(), primary: primary.trim() }, null, 2));

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
