from pydantic import BaseModel, Field


class QuestionOut(BaseModel):
    """A question as shown before answering: never includes the correct option."""

    id: int
    prompt: str
    code: str | None
    options: list[str]


class AnswerIn(BaseModel):
    question_id: int
    choice: int = Field(ge=0)


class AnswersIn(BaseModel):
    answers: list[AnswerIn] = Field(max_length=50)


class ChoiceIn(BaseModel):
    choice: int = Field(ge=0)


class QuestionResult(BaseModel):
    question_id: int
    choice: int | None
    correct_index: int
    is_correct: bool
    explanation: str


class GradedAnswers(BaseModel):
    correct: int
    total: int
    results: list[QuestionResult]

    @property
    def percent(self) -> int:
        return round(100 * self.correct / self.total) if self.total else 0


class CourseSummary(BaseModel):
    slug: str
    level: str
    title: str
    summary: str
    lesson_count: int
    minutes: int


class LessonLink(BaseModel):
    id: int
    slug: str
    title: str
    minutes: int


# Minimum exam score (percent) that earns a certificate. Sent to the client in
# CourseDetail so the UI never hard-codes its own copy.
EXAM_PASS_PERCENT = 70


class CourseDetail(CourseSummary):
    lessons: list[LessonLink]
    exam_question_count: int
    exam_pass_percent: int


class LessonDetail(BaseModel):
    id: int
    slug: str
    title: str
    minutes: int
    body_markdown: str
    takeaways: list[str]
    quiz: list[QuestionOut]
    course_slug: str
    course_title: str
    previous: LessonLink | None
    next: LessonLink | None


class GlossaryEntry(BaseModel):
    term: str
    definition: str
