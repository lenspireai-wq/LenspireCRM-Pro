"""Project-wide structured logging config."""
import json
import logging
import os
import sys
from logging.config import dictConfig


class JsonFormatter(logging.Formatter):
    """Render log records as single-line JSON for downstream aggregation."""

    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        for key, value in record.__dict__.items():
            if key in {"name", "msg", "args", "levelname", "levelno", "pathname", "filename", "module", "exc_info", "exc_text", "stack_info", "lineno", "funcName", "created", "msecs", "relativeCreated", "thread", "threadName", "processName", "process", "message", "asctime"}:
                continue
            try:
                json.dumps(value)
                payload[key] = value
            except (TypeError, ValueError):
                payload[key] = repr(value)
        return json.dumps(payload, ensure_ascii=False)


def configure_logging():
    """Apply JSON logging to stdout; honour LOG_LEVEL env (default INFO)."""
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    use_json = os.getenv("LOG_JSON", "true").lower() == "true"
    handlers = {
        "console": {
            "class": "logging.StreamHandler",
            "stream": sys.stdout,
            "formatter": "json" if use_json else "plain",
        }
    }
    formatters = {
        "plain": {"format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"},
        "json": {"()": "lenspirecrm.logging_config.JsonFormatter"},
    }
    dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": formatters,
            "handlers": handlers,
            "root": {"handlers": ["console"], "level": level},
            "loggers": {
                "django.server": {"handlers": ["console"], "level": level, "propagate": False},
                "django.request": {"handlers": ["console"], "level": level, "propagate": False},
                "apps": {"handlers": ["console"], "level": level, "propagate": False},
            },
        }
    )
    return logging.getLogger("apps")
