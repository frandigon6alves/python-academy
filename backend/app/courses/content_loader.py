"""Reads course content from YAML + Markdown files into plain dataclasses.

Layout (see README "Adding content"):
    content/courses/<slug>/course.yaml
    content/courses/<slug>/lessons/<lesson-slug>.<lang>.md
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml

from app.core.i18n import LANGUAGES

TAKEAWAYS_HEADINGS = {"en": "## Key takeaways", "es": "## Puntos clave"}


class ContentError(ValueError):
    pass


@dataclass
class QuestionData:
    prompt: dict[str, str]
    options: dict[str, list[str]]
    answer: int
    explanation: dict[str, str]
    code: str | None = None


@dataclass
class LessonData:
    slug: str
    minutes: int
    title: dict[str, str] = field(default_factory=dict)
    body: dict[str, str] = field(default_factory=dict)
    takeaways: dict[str, list[str]] = field(default_factory=dict)
    quiz: list[QuestionData] = field(default_factory=list)


@dataclass
class CourseData:
    slug: str
    order: int
    level: str
    title: dict[str, str]
    summary: dict[str, str]
    lessons: list[LessonData]
    exam: list[QuestionData]


def read_yaml(path: Path) -> Any:
    with path.open(encoding="utf-8") as file:
        return yaml.safe_load(file)


def parse_question(raw: dict[str, Any]) -> QuestionData:
    question = QuestionData(
        prompt=raw["prompt"],
        options=raw["options"],
        answer=int(raw["answer"]),
        explanation=raw["explanation"],
        code=(raw.get("code") or "").rstrip() or None,
    )
    for lang in LANGUAGES:
        if not 0 <= question.answer < len(question.options[lang]):
            raise ContentError(f"Answer index out of range in question {raw['prompt']['en']!r}")
    return question


def parse_lesson_markdown(text: str, lang: str) -> tuple[str, str, list[str]]:
    """Split a lesson file into (title, body, takeaways)."""
    lines = text.strip().splitlines()
    if not lines or not lines[0].startswith("# "):
        raise ContentError("A lesson must start with a '# Title' line.")
    title = lines[0][2:].strip()
    heading = TAKEAWAYS_HEADINGS[lang]
    if heading not in lines:
        raise ContentError(f"A lesson must end with a '{heading}' section.")
    split_at = lines.index(heading)
    body = "\n".join(lines[1:split_at]).strip()
    takeaways = [line[2:].strip() for line in lines[split_at + 1 :] if line.startswith("- ")]
    return title, body, takeaways


def load_lesson(lessons_dir: Path, raw: dict[str, Any]) -> LessonData:
    lesson = LessonData(slug=raw["slug"], minutes=int(raw["minutes"]))
    for lang in LANGUAGES:
        path = lessons_dir / f"{lesson.slug}.{lang}.md"
        if not path.exists():
            raise ContentError(f"Missing lesson file: {path}")
        title, body, takeaways = parse_lesson_markdown(path.read_text(encoding="utf-8"), lang)
        lesson.title[lang], lesson.body[lang], lesson.takeaways[lang] = title, body, takeaways
    lesson.quiz = [parse_question(q) for q in raw.get("quiz", [])]
    return lesson


def load_course(course_dir: Path) -> CourseData:
    raw = read_yaml(course_dir / "course.yaml")
    return CourseData(
        slug=raw["slug"],
        order=int(raw["order"]),
        level=raw["level"],
        title=raw["title"],
        summary=raw["summary"],
        lessons=[load_lesson(course_dir / "lessons", lesson) for lesson in raw["lessons"]],
        exam=[parse_question(q) for q in raw["exam"]],
    )


def load_courses(content_dir: Path) -> list[CourseData]:
    course_dirs = sorted(p for p in (content_dir / "courses").iterdir() if p.is_dir())
    return sorted((load_course(d) for d in course_dirs), key=lambda c: c.order)


def load_demo_quiz(content_dir: Path) -> list[QuestionData]:
    return [parse_question(q) for q in read_yaml(content_dir / "demo-quiz.yaml")]
