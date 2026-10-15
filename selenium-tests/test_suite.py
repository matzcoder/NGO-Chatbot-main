import os
import pytest
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

from conftest import SAUCE_URL, INTERNET_URL


def login(driver, username, password):
    driver.get(SAUCE_URL)
    driver.find_element(By.ID, "user-name").send_keys(username)
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.ID, "login-button").click()


def error_text(driver):
    return driver.find_element(By.CSS_SELECTOR, "[data-test='error']").text


def prices(driver):
    elements = driver.find_elements(By.CLASS_NAME, "inventory_item_price")
    return [float(e.text.replace("$", "")) for e in elements]


# Group 1: Login (tests 1-6)


# 1
def test_01_valid_login_redirects_to_inventory(driver, wait):
    login(driver, "standard_user", "secret_sauce")
    wait.until(EC.url_contains("inventory.html"))
    assert driver.find_element(By.CLASS_NAME, "title").text == "Products"


# 2
def test_02_invalid_password_shows_error(driver, wait):
    login(driver, "standard_user", "wrong_password")
    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "[data-test='error']")))
    assert "Username and password do not match" in error_text(driver)


# 3
def test_03_locked_out_user_is_rejected(driver, wait):
    login(driver, "locked_out_user", "secret_sauce")
    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "[data-test='error']")))
    assert "this user has been locked out" in error_text(driver)


# 4
def test_04_empty_username_shows_required_error(driver, wait):
    login(driver, "", "secret_sauce")
    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "[data-test='error']")))
    assert "Username is required" in error_text(driver)


# 5
def test_05_empty_password_shows_required_error(driver, wait):
    login(driver, "standard_user", "")
    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "[data-test='error']")))
    assert "Password is required" in error_text(driver)


# 6
def test_06_logout_returns_to_login_page(logged_in, wait):
    driver = logged_in
    driver.find_element(By.ID, "react-burger-menu-btn").click()
    wait.until(EC.element_to_be_clickable((By.ID, "logout_sidebar_link"))).click()
    wait.until(EC.visibility_of_element_located((By.ID, "login-button")))
    assert driver.current_url.rstrip("/") == SAUCE_URL


# Group 2: Inventory (tests 7-12)


# 7
def test_07_inventory_displays_six_products(logged_in):
    items = logged_in.find_elements(By.CLASS_NAME, "inventory_item")
    assert len(items) == 6


# 8
def test_08_sort_price_low_to_high(logged_in):
    Select(logged_in.find_element(By.CLASS_NAME, "product_sort_container")).select_by_value("lohi")
    result = prices(logged_in)
    assert result == sorted(result)


# 9
def test_09_sort_name_z_to_a(logged_in):
    Select(logged_in.find_element(By.CLASS_NAME, "product_sort_container")).select_by_value("za")
    names = [e.text for e in logged_in.find_elements(By.CLASS_NAME, "inventory_item_name")]
    assert names == sorted(names, reverse=True)


# 10
def test_10_add_to_cart_updates_badge(logged_in):
    logged_in.find_element(By.ID, "add-to-cart-sauce-labs-backpack").click()
    badge = logged_in.find_element(By.CLASS_NAME, "shopping_cart_badge")
    assert badge.text == "1"


# 11
def test_11_remove_from_inventory_clears_badge(logged_in):
    logged_in.find_element(By.ID, "add-to-cart-sauce-labs-backpack").click()
    logged_in.find_element(By.ID, "remove-sauce-labs-backpack").click()
    assert logged_in.find_elements(By.CLASS_NAME, "shopping_cart_badge") == []


# 12
def test_12_product_name_opens_detail_page(logged_in, wait):
    logged_in.find_element(By.ID, "item_4_title_link").click()
    wait.until(EC.url_contains("inventory-item.html"))
    assert logged_in.find_element(By.CLASS_NAME, "inventory_details_name").text == "Sauce Labs Backpack"


# Group 3: Cart and checkout (tests 13-18)


# 13
def test_13_cart_lists_added_item(logged_in, wait):
    logged_in.find_element(By.ID, "add-to-cart-sauce-labs-backpack").click()
    logged_in.find_element(By.CLASS_NAME, "shopping_cart_link").click()
    wait.until(EC.url_contains("cart.html"))
    names = [e.text for e in logged_in.find_elements(By.CLASS_NAME, "inventory_item_name")]
    assert names == ["Sauce Labs Backpack"]


# 14
def test_14_continue_shopping_returns_to_inventory(logged_in, wait):
    logged_in.find_element(By.CLASS_NAME, "shopping_cart_link").click()
    wait.until(EC.url_contains("cart.html"))
    logged_in.find_element(By.ID, "continue-shopping").click()
    wait.until(EC.url_contains("inventory.html"))


# 15
def test_15_checkout_requires_first_name(logged_in, wait):
    logged_in.find_element(By.ID, "add-to-cart-sauce-labs-backpack").click()
    logged_in.find_element(By.CLASS_NAME, "shopping_cart_link").click()
    logged_in.find_element(By.ID, "checkout").click()
    wait.until(EC.url_contains("checkout-step-one"))
    logged_in.find_element(By.ID, "continue").click()
    assert "First Name is required" in error_text(logged_in)


# 16
def test_16_checkout_subtotal_matches_item_prices(logged_in, wait):
    logged_in.find_element(By.ID, "add-to-cart-sauce-labs-backpack").click()
    logged_in.find_element(By.ID, "add-to-cart-sauce-labs-bike-light").click()
    expected = sum(
        float(e.text.replace("$", ""))
        for e in logged_in.find_elements(By.CLASS_NAME, "inventory_item_price")
        if e.find_element(By.XPATH, "../..//button").text == "Remove"
    )
    logged_in.find_element(By.CLASS_NAME, "shopping_cart_link").click()
    logged_in.find_element(By.ID, "checkout").click()
    logged_in.find_element(By.ID, "first-name").send_keys("Asha")
    logged_in.find_element(By.ID, "last-name").send_keys("Kumar")
    logged_in.find_element(By.ID, "postal-code").send_keys("605001")
    logged_in.find_element(By.ID, "continue").click()
    wait.until(EC.url_contains("checkout-step-two"))
    subtotal = logged_in.find_element(By.CLASS_NAME, "summary_subtotal_label").text
    assert float(subtotal.split("$")[1]) == pytest.approx(expected)


# 17
def test_17_complete_order_shows_confirmation(logged_in, wait):
    logged_in.find_element(By.ID, "add-to-cart-sauce-labs-backpack").click()
    logged_in.find_element(By.CLASS_NAME, "shopping_cart_link").click()
    logged_in.find_element(By.ID, "checkout").click()
    logged_in.find_element(By.ID, "first-name").send_keys("Asha")
    logged_in.find_element(By.ID, "last-name").send_keys("Kumar")
    logged_in.find_element(By.ID, "postal-code").send_keys("605001")
    logged_in.find_element(By.ID, "continue").click()
    wait.until(EC.element_to_be_clickable((By.ID, "finish"))).click()
    wait.until(EC.url_contains("checkout-complete"))
    assert logged_in.find_element(By.CLASS_NAME, "complete-header").text == "Thank you for your order!"


# 18
def test_18_remove_item_on_cart_page_empties_cart(logged_in, wait):
    logged_in.find_element(By.ID, "add-to-cart-sauce-labs-backpack").click()
    logged_in.find_element(By.CLASS_NAME, "shopping_cart_link").click()
    wait.until(EC.url_contains("cart.html"))
    logged_in.find_element(By.ID, "remove-sauce-labs-backpack").click()
    assert logged_in.find_elements(By.CLASS_NAME, "cart_item") == []


# Group 4: UI interactions (tests 19-30)


# 19
def test_19_checkboxes_can_be_toggled(driver):
    driver.get(f"{INTERNET_URL}/checkboxes")
    first, second = driver.find_elements(By.CSS_SELECTOR, "input[type='checkbox']")
    assert not first.is_selected()
    assert second.is_selected()
    first.click()
    second.click()
    assert first.is_selected()
    assert not second.is_selected()


# 20
def test_20_dropdown_selects_option(driver):
    driver.get(f"{INTERNET_URL}/dropdown")
    dropdown = Select(driver.find_element(By.ID, "dropdown"))
    dropdown.select_by_visible_text("Option 2")
    assert dropdown.first_selected_option.text == "Option 2"


# 21
def test_21_add_and_remove_elements(driver):
    driver.get(f"{INTERNET_URL}/add_remove_elements/")
    add = driver.find_element(By.CSS_SELECTOR, "button[onclick='addElement()']")
    for _ in range(3):
        add.click()
    assert len(driver.find_elements(By.CLASS_NAME, "added-manually")) == 3
    driver.find_element(By.CLASS_NAME, "added-manually").click()
    assert len(driver.find_elements(By.CLASS_NAME, "added-manually")) == 2


# 22
def test_22_js_alert_can_be_accepted(driver, wait):
    driver.get(f"{INTERNET_URL}/javascript_alerts")
    driver.find_element(By.XPATH, "//button[text()='Click for JS Alert']").click()
    alert = wait.until(EC.alert_is_present())
    alert.accept()
    assert driver.find_element(By.ID, "result").text == "You successfully clicked an alert"


# 23
def test_23_js_confirm_can_be_dismissed(driver, wait):
    driver.get(f"{INTERNET_URL}/javascript_alerts")
    driver.find_element(By.XPATH, "//button[text()='Click for JS Confirm']").click()
    wait.until(EC.alert_is_present()).dismiss()
    assert driver.find_element(By.ID, "result").text == "You clicked: Cancel"


# 24
def test_24_js_prompt_accepts_text(driver, wait):
    driver.get(f"{INTERNET_URL}/javascript_alerts")
    driver.find_element(By.XPATH, "//button[text()='Click for JS Prompt']").click()
    alert = wait.until(EC.alert_is_present())
    alert.send_keys("hello selenium")
    alert.accept()
    assert driver.find_element(By.ID, "result").text == "You entered: hello selenium"


# 25
def test_25_dynamic_loading_uses_explicit_wait(driver, wait):
    driver.get(f"{INTERNET_URL}/dynamic_loading/1")
    driver.find_element(By.CSS_SELECTOR, "#start button").click()
    finish = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "#finish h4")))
    assert finish.text == "Hello World!"


# 26
def test_26_hover_reveals_user_caption(driver, wait):
    driver.get(f"{INTERNET_URL}/hovers")
    figure = driver.find_elements(By.CLASS_NAME, "figure")[0]
    ActionChains(driver).move_to_element(figure).perform()
    caption = wait.until(EC.visibility_of(figure.find_element(By.CSS_SELECTOR, ".figcaption h5")))
    assert caption.text == "name: user1"


# 27
def test_27_key_press_is_detected(driver):
    driver.get(f"{INTERNET_URL}/key_presses")
    # In Chrome, pressing ENTER in a single-input form triggers submit/reload unless default is prevented
    driver.execute_script("document.querySelector('form').addEventListener('submit', function(e) { e.preventDefault(); });")
    driver.find_element(By.ID, "target").send_keys(Keys.ENTER)
    assert driver.find_element(By.ID, "result").text == "You entered: ENTER"


# 28
def test_28_nested_frames_content_is_readable(driver):
    driver.get(f"{INTERNET_URL}/nested_frames")
    driver.switch_to.frame("frame-top")
    driver.switch_to.frame("frame-middle")
    assert driver.find_element(By.ID, "content").text == "MIDDLE"
    driver.switch_to.default_content()


# 29
def test_29_new_window_can_be_switched_to(driver, wait):
    driver.get(f"{INTERNET_URL}/windows")
    original = driver.current_window_handle
    driver.find_element(By.LINK_TEXT, "Click Here").click()
    wait.until(lambda d: len(d.window_handles) == 2)
    new_handle = [h for h in driver.window_handles if h != original][0]
    driver.switch_to.window(new_handle)
    assert driver.find_element(By.TAG_NAME, "h3").text == "New Window"
    driver.close()
    driver.switch_to.window(original)


# 30
def test_30_file_upload_succeeds(driver, tmp_path):
    sample = tmp_path / "sample.txt"
    sample.write_text("hello from selenium")
    driver.get(f"{INTERNET_URL}/upload")
    driver.find_element(By.ID, "file-upload").send_keys(str(sample))
    driver.find_element(By.ID, "file-submit").click()
    assert driver.find_element(By.TAG_NAME, "h3").text == "File Uploaded!"
    assert driver.find_element(By.ID, "uploaded-files").text == "sample.txt"
