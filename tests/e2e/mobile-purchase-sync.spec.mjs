import { expect, test } from "@playwright/test"

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000"
const productPath =
  process.env.E2E_PRODUCT_PATH ?? "/producto/te-humus-liquido-premium"

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
})

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem("biocultor-cart-v1")
    localStorage.setItem("biocultor_gdpr_consent", "necessary-only")
    window.__biocultorE2EEvents = []
    for (const name of [
      "view_item",
      "select_item",
      "add_to_cart",
      "begin_checkout",
      "checkout_error",
    ]) {
      window.addEventListener(`biocultor:ecommerce:${name}`, (event) => {
        window.__biocultorE2EEvents.push({
          name,
          detail: event.detail,
        })
      })
    }
  })
})

test("mobile sticky format remains synced with main product selector", async ({
  page,
}) => {
  await page.goto(`${baseURL}${productPath}`, { waitUntil: "networkidle" })

  await page.getByTestId("product-format-25-litros").click()
  await page.evaluate(() => window.scrollTo(0, 900))

  await expect(page.getByTestId("sticky-variant-25-litros")).toHaveClass(
    /border-primary/
  )
  await expect(page.getByTestId("sticky-total")).not.toHaveText("€19.95")

  const events = await page.evaluate(() => window.__biocultorE2EEvents)
  const lastSelect = events
    .filter((event) => event.name === "select_item")
    .at(-1)

  expect(lastSelect?.detail?.items?.[0]?.item_variant).toBe("25 Litros")
  expect(lastSelect?.detail?.interaction_source).toBe("product_format_grid")
})

test("mobile add-to-cart and checkout payload use the selected variant", async ({
  page,
}) => {
  let checkoutPayload = null

  await page.route("**/api/checkout", async (route) => {
    checkoutPayload = route.request().postDataJSON()
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: null,
      }),
    })
  })

  await page.goto(`${baseURL}${productPath}`, { waitUntil: "networkidle" })
  await page.getByTestId("product-format-1-litro").click()
  await page.evaluate(() => window.scrollTo(0, 900))
  await expect(page.getByTestId("sticky-variant-1-litro")).toHaveClass(
    /border-primary/
  )

  await page.getByTestId("sticky-add-to-cart").click()
  await expect(page.getByTestId("cart-line-item-size")).toHaveText("1 Litro")

  await page.getByTestId("cart-checkout").click()
  await expect
    .poll(() => checkoutPayload, { message: "checkout payload captured" })
    .not.toBeNull()

  expect(checkoutPayload.items).toEqual([
    expect.objectContaining({
      quantity: 1,
    }),
  ])

  const events = await page.evaluate(() => window.__biocultorE2EEvents)
  const addToCart = events.find((event) => event.name === "add_to_cart")
  const beginCheckout = events.find((event) => event.name === "begin_checkout")

  expect(addToCart?.detail?.items?.[0]?.item_variant).toBe("1 Litro")
  expect(beginCheckout?.detail?.items?.[0]?.item_variant).toBe("1 Litro")
  expect(checkoutPayload.items[0].id).toEqual(expect.any(String))
})

test("internal ecommerce ingestion runs only with analytics consent", async ({
  page,
}) => {
  const ingestedEvents = []

  await page.route("**/api/events/ecommerce", async (route) => {
    ingestedEvents.push(route.request().postDataJSON())
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto(`${baseURL}${productPath}`, { waitUntil: "networkidle" })
  await page.evaluate(() => {
    localStorage.setItem("biocultor_gdpr_consent", "all")
    window.scrollTo(0, 0)
  })

  await page.getByTestId("product-format-10-litros").click()
  await page.evaluate(() => window.scrollTo(0, 900))
  await page.getByTestId("sticky-add-to-cart").click()

  await expect
    .poll(() => ingestedEvents.length, {
      message: "internal ecommerce events captured with analytics consent",
    })
    .toBeGreaterThan(0)

  expect(
    ingestedEvents.some(
      (event) =>
        event.eventName === "select_item" &&
        event.items?.[0]?.item_variant === "10 Litros" &&
        event.device === "mobile"
    )
  ).toBe(true)

  expect(
    ingestedEvents.some(
      (event) =>
        event.eventName === "add_to_cart" &&
        event.items?.[0]?.item_variant === "10 Litros" &&
        event.sourcePath?.startsWith("/producto/")
    )
  ).toBe(true)
})

test("internal ecommerce ingestion is suppressed without analytics consent", async ({
  page,
}) => {
  const ingestedEvents = []

  await page.route("**/api/events/ecommerce", async (route) => {
    ingestedEvents.push(route.request().postDataJSON())
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto(`${baseURL}${productPath}`, { waitUntil: "networkidle" })
  await page.evaluate(() => {
    localStorage.setItem("biocultor_gdpr_consent", "necessary-only")
    window.scrollTo(0, 0)
  })

  await page.getByTestId("product-format-10-litros").click()
  await page.evaluate(() => window.scrollTo(0, 900))
  await page.getByTestId("sticky-add-to-cart").click()
  await page.waitForTimeout(750)

  expect(ingestedEvents).toHaveLength(0)

  const browserEvents = await page.evaluate(() => window.__biocultorE2EEvents)
  expect(browserEvents.some((event) => event.name === "add_to_cart")).toBe(true)
})
