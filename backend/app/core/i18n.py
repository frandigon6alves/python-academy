"""Content languages and helpers for bilingual {"en": ..., "es": ...} fields."""

from typing import Literal

Lang = Literal["en", "es"]
LANGUAGES: tuple[Lang, ...] = ("en", "es")
DEFAULT_LANG: Lang = "en"

Localized = dict[str, str]


def pick(value: Localized, lang: Lang) -> str:
    return value.get(lang) or value[DEFAULT_LANG]
