"""Content integrity: every lesson and question exists in both languages."""

from app.core.config import get_settings
from app.core.i18n import LANGUAGES
from app.courses.content_loader import (
    load_courses,
    load_demo_quiz,
    parse_lesson_markdown,
    read_yaml,
)

CONTENT = get_settings().content_dir


def test_every_lesson_exists_in_every_language() -> None:
    courses = load_courses(CONTENT)
    assert len(courses) >= 4
    for course in courses:
        assert 3 <= len(course.lessons) <= 5
        for lesson in course.lessons:
            for lang in LANGUAGES:
                assert (
                    CONTENT / "courses" / course.slug / "lessons" / f"{lesson.slug}.{lang}.md"
                ).exists()
                assert lesson.title[lang] and lesson.body[lang] and lesson.takeaways[lang]


def test_every_question_is_bilingual_with_matching_options() -> None:
    courses = load_courses(CONTENT)
    questions = [q for c in courses for lesson in c.lessons for q in lesson.quiz]
    questions += [q for c in courses for q in c.exam] + load_demo_quiz(CONTENT)
    for question in questions:
        assert (
            set(LANGUAGES) <= question.prompt.keys()
            and set(LANGUAGES) <= question.explanation.keys()
        )
        assert len(question.options["en"]) == len(question.options["es"])


def test_glossary_badges_and_quests_are_bilingual() -> None:
    for term in read_yaml(CONTENT / "glossary.yaml"):
        assert set(LANGUAGES) <= term["term"].keys() and set(LANGUAGES) <= term["definition"].keys()
    for item in read_yaml(CONTENT / "badges.yaml") + read_yaml(CONTENT / "quests.yaml"):
        assert set(LANGUAGES) <= item["name"].keys()


def test_markdown_parser_splits_title_body_and_takeaways() -> None:
    text = "# Loops\n\nIntro text.\n\n## Key takeaways\n\n- One\n- Two\n"
    assert parse_lesson_markdown(text, "en") == ("Loops", "Intro text.", ["One", "Two"])
