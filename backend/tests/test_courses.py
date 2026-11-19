from fastapi.testclient import TestClient


def test_catalogue_lists_courses_in_order(client: TestClient) -> None:
    courses = client.get("/api/v1/courses").json()
    assert [c["slug"] for c in courses] == [
        "python-basics",
        "control-flow",
        "functions-and-modules",
        "data-structures",
    ]
    assert all(3 <= c["lesson_count"] <= 5 and c["minutes"] > 0 for c in courses)


def test_content_is_served_in_spanish(client: TestClient) -> None:
    english = client.get("/api/v1/courses/python-basics").json()
    spanish = client.get("/api/v1/courses/python-basics?lang=es").json()
    assert english["title"] == "Python Basics"
    assert spanish["title"] == "Fundamentos de Python"
    assert len(english["lessons"]) == len(spanish["lessons"])


def test_lesson_never_exposes_answers(client: TestClient) -> None:
    lesson = client.get("/api/v1/courses/python-basics/lessons/variables").json()
    assert lesson["body_markdown"] and lesson["takeaways"]
    assert lesson["previous"] is None and lesson["next"]["slug"] == "types"
    for question in lesson["quiz"]:
        assert set(question) == {"id", "prompt", "code", "options"}


def test_unknown_course_is_a_404_problem(client: TestClient) -> None:
    response = client.get("/api/v1/courses/cobol-for-cats")
    assert response.status_code == 404
    assert response.headers["content-type"] == "application/problem+json"


def test_glossary_is_sorted_alphabetically(client: TestClient) -> None:
    terms = [entry["term"] for entry in client.get("/api/v1/glossary?lang=es").json()]
    assert len(terms) >= 30
    assert terms == sorted(terms, key=str.casefold)


def test_demo_quiz_is_graded_on_the_server_without_an_account(client: TestClient) -> None:
    questions = client.get("/api/v1/demo-quiz").json()
    assert questions and "answer_index" not in questions[0]
    result = client.post(f"/api/v1/demo-quiz/{questions[0]['id']}/check", json={"choice": 0}).json()
    assert result["is_correct"] == (result["correct_index"] == 0)
    assert result["explanation"]
