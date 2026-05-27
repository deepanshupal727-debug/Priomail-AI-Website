"""Backend tests for PrioMail referral and coupon endpoints."""
import os
import pytest
import requests
from datetime import datetime, timezone, timedelta

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://smart-mail-hub-6.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Pre-existing endpoints regression ----------
class TestRootAndStatus:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data

    def test_status_post_and_list(self, session):
        r = session.post(f"{API}/status", json={"client_name": "TEST_client"})
        assert r.status_code == 200
        body = r.json()
        assert body["client_name"] == "TEST_client"
        assert "id" in body

        r2 = session.get(f"{API}/status")
        assert r2.status_code == 200
        assert isinstance(r2.json(), list)


# ---------- Referrals ----------
class TestReferrals:
    created_codes = []

    def test_create_auto_code(self, session):
        r = session.post(f"{API}/referrals", json={
            "owner_name": "TEST_Alice", "owner_email": "alice@test.com",
            "reward_type": "percent", "reward_value": 20.0
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["owner_name"] == "TEST_Alice"
        assert data["code"]
        assert data["active"] is True
        assert data["reward_type"] == "percent"
        TestReferrals.created_codes.append(data["code"])

    def test_create_custom_code_and_duplicate(self, session):
        code = "TESTREF001"
        r = session.post(f"{API}/referrals", json={
            "owner_name": "TEST_Bob", "owner_email": "bob@test.com",
            "reward_type": "fixed", "reward_value": 50.0, "code": code
        })
        assert r.status_code == 200, r.text
        assert r.json()["code"] == code
        TestReferrals.created_codes.append(code)

        # duplicate
        dup = session.post(f"{API}/referrals", json={
            "owner_name": "x", "owner_email": "x@x.com", "code": code
        })
        assert dup.status_code == 400

    def test_list_includes_stats(self, session):
        r = session.get(f"{API}/referrals")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        codes = [x["code"] for x in data]
        for c in TestReferrals.created_codes:
            assert c in codes
        for item in data:
            assert "stats" in item
            assert {"clicks", "signups", "conversions", "revenue", "reward_earned"} <= set(item["stats"].keys())

    def test_get_single_referral(self, session):
        code = TestReferrals.created_codes[0]
        r = session.get(f"{API}/referrals/{code}")
        assert r.status_code == 200
        assert r.json()["code"] == code

    def test_events_and_stats_percent(self, session):
        # use TESTREF001 (percent? no it's fixed). Use the first (percent, 20)
        code = TestReferrals.created_codes[0]
        # click
        c = session.post(f"{API}/referrals/{code}/events", json={"event_type": "click"})
        assert c.status_code == 200
        # signup
        s = session.post(f"{API}/referrals/{code}/events", json={"event_type": "signup", "email": "u@x.com"})
        assert s.status_code == 200
        # conversion $100
        conv = session.post(f"{API}/referrals/{code}/events", json={"event_type": "conversion", "amount": 100.0})
        assert conv.status_code == 200
        # conversion $50
        conv2 = session.post(f"{API}/referrals/{code}/events", json={"event_type": "conversion", "amount": 50.0})
        assert conv2.status_code == 200

        # list events
        ev = session.get(f"{API}/referrals/{code}/events")
        assert ev.status_code == 200
        assert len(ev.json()) >= 4

        # stats
        r = session.get(f"{API}/referrals/{code}")
        stats = r.json()["stats"]
        assert stats["clicks"] >= 1
        assert stats["signups"] >= 1
        assert stats["conversions"] >= 2
        assert stats["revenue"] >= 150.0
        # percent reward 20% of 150 = 30
        assert stats["reward_earned"] >= 30.0

    def test_events_and_stats_fixed(self, session):
        code = "TESTREF001"  # fixed 50
        session.post(f"{API}/referrals/{code}/events", json={"event_type": "conversion", "amount": 200.0})
        session.post(f"{API}/referrals/{code}/events", json={"event_type": "conversion", "amount": 300.0})
        r = session.get(f"{API}/referrals/{code}")
        stats = r.json()["stats"]
        assert stats["conversions"] >= 2
        # fixed: conversions * value
        assert stats["reward_earned"] >= 2 * 50.0
        assert stats["revenue"] >= 500.0

    def test_patch_toggle_active(self, session):
        code = TestReferrals.created_codes[0]
        r = session.patch(f"{API}/referrals/{code}", json={"active": False})
        assert r.status_code == 200
        assert r.json()["active"] is False
        # event on inactive should be rejected
        bad = session.post(f"{API}/referrals/{code}/events", json={"event_type": "click"})
        assert bad.status_code == 400
        # toggle back
        session.patch(f"{API}/referrals/{code}", json={"active": True})

    def test_event_on_unknown_referral(self, session):
        r = session.post(f"{API}/referrals/NONEXISTENT_XYZ/events", json={"event_type": "click"})
        assert r.status_code == 404

    def test_delete_referral(self, session):
        # create then delete
        r = session.post(f"{API}/referrals", json={
            "owner_name": "TEST_temp", "owner_email": "t@t.com", "code": "TESTDEL01"
        })
        assert r.status_code == 200
        d = session.delete(f"{API}/referrals/TESTDEL01")
        assert d.status_code == 200
        g = session.get(f"{API}/referrals/TESTDEL01")
        assert g.status_code == 404


# ---------- Coupons ----------
class TestCoupons:
    created = []

    def test_create_auto_save_code(self, session):
        r = session.post(f"{API}/coupons", json={
            "description": "TEST_auto", "discount_type": "percent", "discount_value": 15.0
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["code"].startswith("SAVE")
        assert len(data["code"]) == 10  # SAVE + 6
        TestCoupons.created.append(data["code"])

    def test_create_custom_and_duplicate(self, session):
        r = session.post(f"{API}/coupons", json={
            "code": "TESTCPN1", "description": "TEST custom", "discount_type": "fixed",
            "discount_value": 25.0, "max_uses": 2
        })
        assert r.status_code == 200
        TestCoupons.created.append("TESTCPN1")
        dup = session.post(f"{API}/coupons", json={"code": "TESTCPN1"})
        assert dup.status_code == 400

    def test_list_and_get(self, session):
        r = session.get(f"{API}/coupons")
        assert r.status_code == 200
        codes = [c["code"] for c in r.json()]
        assert "TESTCPN1" in codes
        g = session.get(f"{API}/coupons/TESTCPN1")
        assert g.status_code == 200
        assert g.json()["discount_value"] == 25.0

    def test_validate_valid(self, session):
        r = session.post(f"{API}/coupons/TESTCPN1/validate")
        assert r.status_code == 200
        data = r.json()
        assert data["valid"] is True
        assert data["discount_type"] == "fixed"
        assert data["discount_value"] == 25.0

    def test_validate_not_found(self, session):
        r = session.post(f"{API}/coupons/NONEXISTENT/validate")
        assert r.status_code == 200
        assert r.json()["valid"] is False

    def test_validate_inactive(self, session):
        session.post(f"{API}/coupons", json={"code": "TESTINACT", "active": False})
        TestCoupons.created.append("TESTINACT")
        r = session.post(f"{API}/coupons/TESTINACT/validate")
        assert r.json()["valid"] is False
        assert "inactive" in r.json()["reason"].lower()

    def test_validate_expired(self, session):
        past = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
        session.post(f"{API}/coupons", json={"code": "TESTEXP1", "valid_until": past})
        TestCoupons.created.append("TESTEXP1")
        r = session.post(f"{API}/coupons/TESTEXP1/validate")
        assert r.json()["valid"] is False
        assert "expir" in r.json()["reason"].lower()

    def test_redeem_and_max_uses(self, session):
        # TESTCPN1 max_uses=2
        r1 = session.post(f"{API}/coupons/TESTCPN1/redeem", json={"user_email": "a@a.com"})
        assert r1.status_code == 200
        r2 = session.post(f"{API}/coupons/TESTCPN1/redeem", json={"user_email": "b@b.com"})
        assert r2.status_code == 200
        # third should fail (limit reached)
        r3 = session.post(f"{API}/coupons/TESTCPN1/redeem", json={"user_email": "c@c.com"})
        assert r3.status_code == 400
        # validate should now indicate limit reached
        v = session.post(f"{API}/coupons/TESTCPN1/validate")
        assert v.json()["valid"] is False
        assert "limit" in v.json()["reason"].lower() or "reached" in v.json()["reason"].lower()
        # redemptions list
        reds = session.get(f"{API}/coupons/TESTCPN1/redemptions")
        assert reds.status_code == 200
        assert len(reds.json()) >= 2

    def test_patch_coupon(self, session):
        r = session.patch(f"{API}/coupons/TESTCPN1", json={"description": "updated"})
        assert r.status_code == 200
        assert r.json()["description"] == "updated"

    def test_delete_coupon(self, session):
        session.post(f"{API}/coupons", json={"code": "TESTDELCPN"})
        d = session.delete(f"{API}/coupons/TESTDELCPN")
        assert d.status_code == 200
        g = session.get(f"{API}/coupons/TESTDELCPN")
        assert g.status_code == 404


# ---------- Admin stats ----------
class TestAdminStats:
    def test_stats_structure(self, session):
        r = session.get(f"{API}/admin/stats")
        assert r.status_code == 200
        data = r.json()
        assert "referrals" in data and "coupons" in data
        ref = data["referrals"]
        for k in ["total", "active", "clicks", "signups", "conversions", "revenue"]:
            assert k in ref
        cp = data["coupons"]
        for k in ["total", "active", "redemptions"]:
            assert k in cp
        # counts are non-negative
        assert ref["total"] >= 1
        assert ref["conversions"] >= 1
        assert cp["total"] >= 1


# ---------- Cleanup ----------
def test_zz_cleanup(session):
    # Clean referrals
    refs = session.get(f"{API}/referrals").json()
    for r in refs:
        if r["owner_name"].startswith("TEST_") or r["code"].startswith("TEST"):
            session.delete(f"{API}/referrals/{r['code']}")
    # Clean coupons
    coups = session.get(f"{API}/coupons").json()
    for c in coups:
        if (c.get("description") or "").startswith("TEST") or c["code"].startswith("TEST"):
            session.delete(f"{API}/coupons/{c['code']}")
