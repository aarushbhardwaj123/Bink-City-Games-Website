import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))


class Config:
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
    CLUBGG_AGENT_USERNAME = os.getenv("CLUBGG_AGENT_USERNAME")
    CLUBGG_AGENT_PASSWORD = os.getenv("CLUBGG_AGENT_PASSWORD")
    API_BASE_URL = os.getenv("NEXTAUTH_URL", "http://localhost:3000")
    APPIUM_SERVER = os.getenv("APPIUM_SERVER", "http://localhost:4723")
    SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
    MAX_RETRIES = int(os.getenv("WORKER_MAX_RETRIES", "3"))
    RETRY_DELAY_SECONDS = int(os.getenv("WORKER_RETRY_DELAY", "5"))


config = Config()
