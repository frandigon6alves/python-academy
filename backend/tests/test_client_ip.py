"""Which client address the login rate limiter uses behind the Vercel -> Render proxy chain."""

import pytest
from fastapi.testclient import TestClient

from app.core.config import get_settings
from tests.conftest import PASSWORD, sign_up

LOGIN = "/api/v1/auth/login"
SECRET = "proxy-secret-for-tests"


def fail_logins(client: TestClient, times: int, headers: dict[str, str]) -> None:
    for _ in range(times):
        client.post(LOGIN, json={"email": "ada@example.com", "password": "wrong"}, headers=headers)


def login(client: TestClient, headers: dict[str, str]) -> int:
    body = {"email": "ada@example.com", "password": PASSWORD}
    return int(client.post(LOGIN, json=body, headers=headers).status_code)


@pytest.fixture
def proxy_secret(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(get_settings(), "proxy_secret", SECRET)


def via_proxy(ip: str) -> dict[str, str]:
    return {"X-Academy-Proxy-Secret": SECRET, "X-Academy-Client-IP": ip}


@pytest.mark.usefixtures("proxy_secret")
def test_rate_limit_is_per_client_ip_sent_by_the_trusted_proxy(client: TestClient) -> None:
    sign_up(client)
    fail_logins(client, 5, via_proxy("203.0.113.7"))
    assert login(client, via_proxy("203.0.113.7")) == 429
    assert login(client, via_proxy("198.51.100.20")) == 200


@pytest.mark.usefixtures("proxy_secret")
def test_forged_client_ips_without_the_secret_share_one_bucket(client: TestClient) -> None:
    sign_up(client)
    for n in range(5):
        forged = {"X-Academy-Client-IP": f"192.0.2.{n}", "X-Forwarded-For": f"192.0.2.{n}"}
        fail_logins(client, 1, forged)
    wrong_secret = {"X-Academy-Proxy-Secret": "guess", "X-Academy-Client-IP": "192.0.2.99"}
    assert login(client, wrong_secret) == 429
    # People who come through the website are not locked out by it.
    assert login(client, via_proxy("203.0.113.7")) == 200
