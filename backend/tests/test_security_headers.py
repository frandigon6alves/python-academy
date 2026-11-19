from fastapi.testclient import TestClient

from tests.conftest import PASSWORD


def test_every_response_carries_the_security_headers(client: TestClient) -> None:
    response = client.get("/api/v1/courses")
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["referrer-policy"] == "no-referrer"


def test_public_content_may_be_cached(client: TestClient) -> None:
    response = client.get("/api/v1/glossary")
    assert "no-store" not in response.headers.get("cache-control", "")


def test_personal_responses_are_never_cached(client: TestClient) -> None:
    assert client.get("/api/v1/auth/me").headers["cache-control"] == "no-store"
    signup = client.post(
        "/api/v1/auth/signup",
        json={"email": "ada@example.com", "display_name": "Ada", "password": PASSWORD},
        headers={"X-Requested-With": "fetch"},
    )
    assert signup.headers["cache-control"] == "no-store"
    assert client.get("/api/v1/progress/me").headers["cache-control"] == "no-store"


def test_csrf_rejections_also_carry_the_headers(client: TestClient) -> None:
    # The test client sends the CSRF header by default; blank it to simulate a forged post.
    response = client.post("/api/v1/auth/logout", headers={"X-Requested-With": ""})
    assert response.status_code == 403
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["cache-control"] == "no-store"
