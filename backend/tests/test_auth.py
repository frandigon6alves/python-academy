from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.users.models import User
from tests.conftest import PASSWORD, sign_up

LOGIN = "/api/v1/auth/login"


def test_signup_sets_a_secure_session_cookie(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "Ada@Example.com", "display_name": "Ada", "password": PASSWORD},
    )
    assert response.status_code == 201
    assert response.json()["email"] == "ada@example.com"
    cookie = response.headers["set-cookie"].lower()
    assert "httponly" in cookie and "samesite=lax" in cookie
    assert client.get("/api/v1/auth/me").json()["display_name"] == "Ada"


def test_signup_keeps_the_visitors_language_and_theme(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "ada@example.com",
            "display_name": "Ada",
            "password": PASSWORD,
            "language": "es",
            "theme": "dark",
        },
    )
    assert response.status_code == 201
    me = client.get("/api/v1/auth/me").json()
    assert me["language"] == "es" and me["theme"] == "dark"


def test_password_is_hashed_with_argon2(client: TestClient, db: Session) -> None:
    sign_up(client)
    user = db.scalar(select(User))
    assert user is not None and user.password_hash.startswith("$argon2")
    assert "password" not in client.get("/api/v1/auth/me").text


def test_duplicate_email_is_a_conflict_problem(client: TestClient) -> None:
    sign_up(client)
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "ada@example.com", "display_name": "Other", "password": PASSWORD},
    )
    assert response.status_code == 409
    assert response.headers["content-type"] == "application/problem+json"
    assert response.json()["type"] == "/problems/email-taken"


def test_bad_credentials_return_the_same_generic_error(client: TestClient) -> None:
    sign_up(client)
    client.post("/api/v1/auth/logout")
    wrong_password = client.post(LOGIN, json={"email": "ada@example.com", "password": "nope"})
    unknown_email = client.post(LOGIN, json={"email": "who@example.com", "password": "nope"})
    assert wrong_password.status_code == unknown_email.status_code == 401
    assert wrong_password.json()["detail"] == unknown_email.json()["detail"]


def test_login_then_logout(client: TestClient) -> None:
    sign_up(client)
    client.post("/api/v1/auth/logout")
    assert client.get("/api/v1/auth/me").json() is None
    response = client.post(LOGIN, json={"email": "ada@example.com", "password": PASSWORD})
    assert response.status_code == 200
    assert client.get("/api/v1/auth/me").status_code == 200
    assert client.post("/api/v1/auth/logout").status_code == 204
    assert client.get("/api/v1/auth/me").json() is None


def test_who_am_i_returns_null_for_visitors(client: TestClient) -> None:
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    assert response.json() is None


def test_protected_endpoints_still_require_a_session(client: TestClient) -> None:
    for path in ("/api/v1/progress/me", "/api/v1/gamification/me"):
        response = client.get(path)
        assert response.status_code == 401
        assert response.json()["type"] == "/problems/not-authenticated"


def test_login_is_rate_limited_after_repeated_failures(client: TestClient) -> None:
    sign_up(client)
    for _ in range(5):
        client.post(LOGIN, json={"email": "ada@example.com", "password": "wrong"})
    blocked = client.post(LOGIN, json={"email": "ada@example.com", "password": PASSWORD})
    assert blocked.status_code == 429
    assert blocked.json()["type"] == "/problems/rate-limited"


def test_state_changing_requests_need_the_csrf_header(client: TestClient) -> None:
    response = client.post(
        LOGIN,
        json={"email": "ada@example.com", "password": PASSWORD},
        headers={"X-Requested-With": ""},
    )
    assert response.status_code == 403


def test_validation_errors_are_problem_details(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/signup", json={"email": "not-an-email", "display_name": "A", "password": "x"}
    )
    assert response.status_code == 422
    body = response.json()
    assert body["status"] == 422
    assert {error["field"] for error in body["errors"]} == {"email", "display_name", "password"}
