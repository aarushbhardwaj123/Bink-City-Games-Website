"""
ClubGG GUI Automation Agent

Drives the ClubGG application via Appium (Android emulator) to:
  1. Log in with agent credentials
  2. Navigate to a club by Club ID
  3. Find a player by Player ID
  4. Send the requested number of tokens

Falls back to desktop automation via PyAutoGUI if Appium is unavailable.
"""

import os
import time
import datetime
from config import config

try:
    from appium import webdriver as appium_webdriver
    from appium.options.android import UiAutomator2Options
    from appium.webdriver.common.appiumby import AppiumBy

    APPIUM_AVAILABLE = True
except ImportError:
    APPIUM_AVAILABLE = False

try:
    import pyautogui

    PYAUTOGUI_AVAILABLE = True
except ImportError:
    PYAUTOGUI_AVAILABLE = False


class ClubGGAgentError(Exception):
    """Raised when the agent encounters a non-retryable error."""

    pass


class ClubGGValidationError(ClubGGAgentError):
    """Raised when club or player ID is invalid -- triggers refund, not retry."""

    pass


def _screenshot(driver, label: str):
    """Save a screenshot for debugging."""
    os.makedirs(config.SCREENSHOT_DIR, exist_ok=True)
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    path = os.path.join(config.SCREENSHOT_DIR, f"{ts}_{label}.png")
    try:
        driver.save_screenshot(path)
        print(f"[Agent] Screenshot saved: {path}")
    except Exception as e:
        print(f"[Agent] Screenshot failed: {e}")


def _wait_and_find(driver, by, value, timeout=15):
    """Poll for an element with timeout."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            el = driver.find_element(by, value)
            if el.is_displayed():
                return el
        except Exception:
            pass
        time.sleep(0.5)
    raise ClubGGAgentError(f"Element not found: {by}={value} (timeout={timeout}s)")


class AppiumClubGGAgent:
    """Drives ClubGG via Appium on an Android emulator."""

    def __init__(self):
        if not APPIUM_AVAILABLE:
            raise ClubGGAgentError("Appium Python client is not installed")

        self.driver = None

    def connect(self):
        options = UiAutomator2Options()
        options.platform_name = "Android"
        options.device_name = "emulator-5554"
        options.no_reset = True
        # Update this to the actual ClubGG package/activity from your emulator
        options.app_package = "com.clubgg.poker"
        options.app_activity = "com.clubgg.poker.MainActivity"
        options.new_command_timeout = 300

        self.driver = appium_webdriver.Remote(
            config.APPIUM_SERVER, options=options
        )
        print("[Agent] Connected to Appium session")

    def disconnect(self):
        if self.driver:
            try:
                self.driver.quit()
            except Exception:
                pass
            self.driver = None

    def login(self):
        """Log in to ClubGG with agent credentials. Skip if already logged in."""
        try:
            # Check if we're already on the main screen (logged in)
            self.driver.find_element(AppiumBy.XPATH, "//android.widget.TextView[contains(@text, 'Club')]")
            print("[Agent] Already logged in")
            return
        except Exception:
            pass

        print("[Agent] Logging in...")
        _screenshot(self.driver, "pre_login")

        # These selectors are placeholders -- update to match actual ClubGG UI
        username_field = _wait_and_find(
            self.driver,
            AppiumBy.XPATH,
            "//android.widget.EditText[@resource-id='username' or contains(@text, 'Username') or contains(@hint, 'username')]",
        )
        username_field.clear()
        username_field.send_keys(config.CLUBGG_AGENT_USERNAME)

        password_field = _wait_and_find(
            self.driver,
            AppiumBy.XPATH,
            "//android.widget.EditText[@resource-id='password' or @password='true']",
        )
        password_field.clear()
        password_field.send_keys(config.CLUBGG_AGENT_PASSWORD)

        login_btn = _wait_and_find(
            self.driver,
            AppiumBy.XPATH,
            "//android.widget.Button[contains(@text, 'Login') or contains(@text, 'Sign In')]",
        )
        login_btn.click()

        time.sleep(3)
        _screenshot(self.driver, "post_login")
        print("[Agent] Login complete")

    def navigate_to_club(self, club_id: str):
        """Navigate to a club by its ID. Raises ClubGGValidationError if not found."""
        print(f"[Agent] Navigating to club {club_id}...")
        _screenshot(self.driver, "pre_club_nav")

        # Tap the club search / join area
        try:
            search_btn = _wait_and_find(
                self.driver,
                AppiumBy.XPATH,
                "//android.widget.TextView[contains(@text, 'Search') or contains(@text, 'Join')]",
                timeout=10,
            )
            search_btn.click()
        except ClubGGAgentError:
            _screenshot(self.driver, "club_search_not_found")
            raise

        time.sleep(1)

        # Enter club ID
        search_input = _wait_and_find(
            self.driver,
            AppiumBy.XPATH,
            "//android.widget.EditText",
        )
        search_input.clear()
        search_input.send_keys(club_id)

        # Tap search
        try:
            go_btn = _wait_and_find(
                self.driver,
                AppiumBy.XPATH,
                "//android.widget.Button[contains(@text, 'Search') or contains(@text, 'Go')]",
                timeout=5,
            )
            go_btn.click()
        except ClubGGAgentError:
            # Try pressing enter instead
            self.driver.press_keycode(66)

        time.sleep(3)
        _screenshot(self.driver, "club_search_result")

        # Check if club was found
        try:
            _wait_and_find(
                self.driver,
                AppiumBy.XPATH,
                f"//android.widget.TextView[contains(@text, '{club_id}')]",
                timeout=10,
            )
        except ClubGGAgentError:
            _screenshot(self.driver, "club_not_found")
            raise ClubGGValidationError(f"Club ID '{club_id}' not found in ClubGG")

        print(f"[Agent] Found club {club_id}")

    def find_player(self, player_id: str):
        """Find a player within the current club. Raises ClubGGValidationError if not found."""
        print(f"[Agent] Searching for player {player_id}...")
        _screenshot(self.driver, "pre_player_search")

        # Navigate to member list
        try:
            members_btn = _wait_and_find(
                self.driver,
                AppiumBy.XPATH,
                "//android.widget.TextView[contains(@text, 'Member') or contains(@text, 'Player')]",
                timeout=10,
            )
            members_btn.click()
        except ClubGGAgentError:
            _screenshot(self.driver, "members_tab_not_found")
            raise

        time.sleep(2)

        # Search for the player
        try:
            search_input = _wait_and_find(
                self.driver,
                AppiumBy.XPATH,
                "//android.widget.EditText",
                timeout=10,
            )
            search_input.clear()
            search_input.send_keys(player_id)
            time.sleep(2)
        except ClubGGAgentError:
            _screenshot(self.driver, "player_search_input_not_found")
            raise

        _screenshot(self.driver, "player_search_result")

        # Check if player exists
        try:
            _wait_and_find(
                self.driver,
                AppiumBy.XPATH,
                f"//android.widget.TextView[contains(@text, '{player_id}')]",
                timeout=10,
            )
        except ClubGGAgentError:
            _screenshot(self.driver, "player_not_found")
            raise ClubGGValidationError(
                f"Player ID '{player_id}' not found in club"
            )

        print(f"[Agent] Found player {player_id}")

    def send_tokens(self, player_id: str, amount: int):
        """Send tokens to the player. Assumes player is already found/selected."""
        print(f"[Agent] Sending {amount} tokens to {player_id}...")
        _screenshot(self.driver, "pre_send_tokens")

        # Tap on the player to open their profile
        player_el = _wait_and_find(
            self.driver,
            AppiumBy.XPATH,
            f"//android.widget.TextView[contains(@text, '{player_id}')]",
        )
        player_el.click()
        time.sleep(1)

        # Tap "Send" or "Transfer" button
        send_btn = _wait_and_find(
            self.driver,
            AppiumBy.XPATH,
            "//android.widget.Button[contains(@text, 'Send') or contains(@text, 'Transfer') or contains(@text, 'Give')]",
        )
        send_btn.click()
        time.sleep(1)

        # Enter amount
        amount_input = _wait_and_find(
            self.driver,
            AppiumBy.XPATH,
            "//android.widget.EditText",
        )
        amount_input.clear()
        amount_input.send_keys(str(amount))

        # Confirm
        confirm_btn = _wait_and_find(
            self.driver,
            AppiumBy.XPATH,
            "//android.widget.Button[contains(@text, 'Confirm') or contains(@text, 'OK') or contains(@text, 'Send')]",
        )
        confirm_btn.click()

        time.sleep(3)
        _screenshot(self.driver, "post_send_tokens")

        # Verify success dialog/toast
        try:
            _wait_and_find(
                self.driver,
                AppiumBy.XPATH,
                "//android.widget.TextView[contains(@text, 'Success') or contains(@text, 'success') or contains(@text, 'sent')]",
                timeout=10,
            )
            print(f"[Agent] Successfully sent {amount} tokens to {player_id}")
        except ClubGGAgentError:
            _screenshot(self.driver, "send_tokens_uncertain")
            print(
                f"[Agent] Token send may have succeeded but confirmation not detected"
            )

    def deliver(self, club_id: str, player_id: str, amount: int):
        """Full delivery flow: login -> navigate to club -> find player -> send tokens."""
        try:
            self.connect()
            self.login()
            self.navigate_to_club(club_id)
            self.find_player(player_id)
            self.send_tokens(player_id, amount)
            return True
        finally:
            self.disconnect()


class DesktopClubGGAgent:
    """
    Fallback agent using PyAutoGUI for desktop app automation.
    Much more fragile than Appium -- use only if Android emulator isn't available.
    """

    def deliver(self, club_id: str, player_id: str, amount: int):
        if not PYAUTOGUI_AVAILABLE:
            raise ClubGGAgentError("PyAutoGUI is not installed")

        raise NotImplementedError(
            "Desktop automation requires screen-specific image templates. "
            "Set up reference screenshots in worker/templates/ and implement "
            "the pyautogui.locateOnScreen flow for your specific screen resolution."
        )


def get_agent():
    """Return the best available automation agent."""
    if APPIUM_AVAILABLE:
        return AppiumClubGGAgent()
    if PYAUTOGUI_AVAILABLE:
        return DesktopClubGGAgent()
    raise ClubGGAgentError(
        "No automation backend available. Install appium-python-client or pyautogui."
    )
