from fastapi.testclient import TestClient
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.gamification.models import ActivityEvent
from tests.conftest import PASSWORD, sign_up
from tests.helpers import answers_for, lesson_by_slug, quiz_questions

ME = "/api/v1/users/me"


def test_update_settings(client: TestClient) -> None:
    sign_up(client)
    response = client.patch(ME, json={"display_name": "Ada L.", "language": "es", "theme": "dark"})
    assert response.status_code == 200
    assert response.json() | {"id": 0} == {
        "id": 0,
        "email": "ada@example.com",
        "display_name": "Ada L.",
        "language": "es",
        "theme": "dark",
    }


def test_settings_reject_unknown_values(client: TestClient) -> None:
    sign_up(client)
    assert client.patch(ME, json={"language": "fr"}).status_code == 422
    assert client.patch(ME, json={"theme": "neon"}).status_code == 422


def test_change_password_requires_the_current_one(client: TestClient) -> None:
    sign_up(client)
    wrong = client.post(
        f"{ME}/password", json={"current_password": "nope", "new_password": "new-password-1"}
    )
    assert wrong.status_code == 403
    ok = client.post(
        f"{ME}/password", json={"current_password": PASSWORD, "new_password": "new-password-1"}
    )
    assert ok.status_code == 204
    client.post("/api/v1/auth/logout")
    login = client.post(
        "/api/v1/auth/login", json={"email": "ada@example.com", "password": "new-password-1"}
    )
    assert login.status_code == 200


def test_delete_account_requires_password_and_confirmation(client: TestClient, db: Session) -> None:
    sign_up(client)
    lesson = lesson_by_slug(db, "python-basics", "variables")
    client.post(
        f"/api/v1/lessons/{lesson.id}/quiz",
        json={"answers": answers_for(quiz_questions(db, lesson.id))},
    )

    no_confirm = client.request("DELETE", ME, json={"password": PASSWORD, "confirmation": "yes"})
    assert no_confirm.status_code == 422
    wrong = client.request("DELETE", ME, json={"password": "nope", "confirmation": "DELETE"})
    assert wrong.status_code == 403

    ok = client.request("DELETE", ME, json={"password": PASSWORD, "confirmation": "DELETE"})
    assert ok.status_code == 204
    assert client.get(ME).status_code == 401
    assert db.scalar(select(func.count()).select_from(ActivityEvent)) == 0
