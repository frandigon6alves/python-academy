"""Course content. Text fields are JSON dicts keyed by language: {"en": ..., "es": ...}."""

from sqlalchemy import JSON, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True)
    position: Mapped[int]
    level: Mapped[str] = mapped_column(String(20))
    title: Mapped[dict[str, str]] = mapped_column(JSON)
    summary: Mapped[dict[str, str]] = mapped_column(JSON)

    lessons: Mapped[list["Lesson"]] = relationship(
        back_populates="course", order_by="Lesson.position"
    )


class Lesson(Base):
    __tablename__ = "lessons"
    __table_args__ = (UniqueConstraint("course_id", "slug"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"))
    slug: Mapped[str] = mapped_column(String(80))
    position: Mapped[int]
    minutes: Mapped[int]
    title: Mapped[dict[str, str]] = mapped_column(JSON)
    body: Mapped[dict[str, str]] = mapped_column(JSON)
    # {"en": ["takeaway", ...], "es": [...]}
    takeaways: Mapped[dict[str, list[str]]] = mapped_column(JSON)

    course: Mapped[Course] = relationship(back_populates="lessons")


class Question(Base):
    """A multiple-choice question for a lesson quiz, a course exam or the public demo."""

    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    kind: Mapped[str] = mapped_column(String(10), index=True)  # quiz | exam | demo
    course_id: Mapped[int | None] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"))
    lesson_id: Mapped[int | None] = mapped_column(ForeignKey("lessons.id", ondelete="CASCADE"))
    position: Mapped[int]
    prompt: Mapped[dict[str, str]] = mapped_column(JSON)
    code: Mapped[str | None]
    options: Mapped[dict[str, list[str]]] = mapped_column(JSON)
    answer_index: Mapped[int]
    explanation: Mapped[dict[str, str]] = mapped_column(JSON)


class GlossaryTerm(Base):
    __tablename__ = "glossary_terms"

    id: Mapped[int] = mapped_column(primary_key=True)
    term: Mapped[dict[str, str]] = mapped_column(JSON)
    definition: Mapped[dict[str, str]] = mapped_column(JSON)
