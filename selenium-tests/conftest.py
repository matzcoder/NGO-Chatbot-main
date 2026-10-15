import os
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

SAUCE_URL = "https://www.saucedemo.com"
INTERNET_URL = "https://the-internet.herokuapp.com"


def pytest_addoption(parser):
    parser.addoption(
        "--headless",
        action="store_true",
        default=False,
        help="Run tests in headless mode",
    )
    parser.addoption(
        "--headed",
        action="store_true",
        default=False,
        help="Run tests in headed (visible) browser mode",
    )


@pytest.fixture
def driver(request):
    options = Options()
    options.add_argument("--window-size=1280,900")
    
    # Check headless preference: headed flag forces visible, otherwise default to headless for clean automated runs
    is_headed = request.config.getoption("--headed", default=False) or os.environ.get("HEADED", "0") == "1"
    is_headless = request.config.getoption("--headless", default=False) or os.environ.get("HEADLESS", "1") == "1"
    
    if is_headless and not is_headed:
        options.add_argument("--headless=new")
        
    drv = webdriver.Chrome(options=options)
    drv.implicitly_wait(0)  # use explicit waits only
    yield drv
    drv.quit()


@pytest.fixture
def wait(driver):
    return WebDriverWait(driver, 10)


@pytest.fixture
def logged_in(driver, wait):
    """Log in to SauceDemo as the standard user and land on the inventory page."""
    driver.get(SAUCE_URL)
    driver.find_element(By.ID, "user-name").send_keys("standard_user")
    driver.find_element(By.ID, "password").send_keys("secret_sauce")
    driver.find_element(By.ID, "login-button").click()
    wait.until(EC.url_contains("inventory.html"))
    return driver
