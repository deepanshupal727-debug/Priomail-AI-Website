from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import string
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============================================================
# Original status check models (kept for backward compatibility)
# ============================================================
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# ============================================================
# Referral models
# ============================================================
RewardType = Literal["percent", "fixed", "month", "credit"]


class Referral(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    owner_name: str
    owner_email: str
    reward_type: RewardType = "percent"
    reward_value: float = 20.0
    notes: Optional[str] = ""
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReferralCreate(BaseModel):
    owner_name: str
    owner_email: str
    reward_type: RewardType = "percent"
    reward_value: float = 20.0
    notes: Optional[str] = ""
    code: Optional[str] = None  # optional custom code


class ReferralUpdate(BaseModel):
    owner_name: Optional[str] = None
    owner_email: Optional[str] = None
    reward_type: Optional[RewardType] = None
    reward_value: Optional[float] = None
    notes: Optional[str] = None
    active: Optional[bool] = None


EventType = Literal["click", "signup", "conversion"]


class ReferralEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    referral_code: str
    event_type: EventType
    email: Optional[str] = None
    name: Optional[str] = None
    amount: Optional[float] = None  # used for conversion (deal value)
    metadata: Optional[dict] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReferralEventCreate(BaseModel):
    event_type: EventType
    email: Optional[str] = None
    name: Optional[str] = None
    amount: Optional[float] = None
    metadata: Optional[dict] = None


class ReferralStats(BaseModel):
    code: str
    clicks: int
    signups: int
    conversions: int
    revenue: float
    reward_earned: float


class ReferralWithStats(Referral):
    stats: ReferralStats


# ============================================================
# Coupon models
# ============================================================
DiscountType = Literal["percent", "fixed"]


class Coupon(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    description: Optional[str] = ""
    discount_type: DiscountType = "percent"
    discount_value: float = 10.0
    max_uses: Optional[int] = None  # None = unlimited
    current_uses: int = 0
    valid_until: Optional[datetime] = None  # None = no expiry
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CouponCreate(BaseModel):
    code: Optional[str] = None  # auto-gen if missing
    description: Optional[str] = ""
    discount_type: DiscountType = "percent"
    discount_value: float = 10.0
    max_uses: Optional[int] = None
    valid_until: Optional[datetime] = None
    active: bool = True


class CouponUpdate(BaseModel):
    description: Optional[str] = None
    discount_type: Optional[DiscountType] = None
    discount_value: Optional[float] = None
    max_uses: Optional[int] = None
    valid_until: Optional[datetime] = None
    active: Optional[bool] = None


class CouponRedemption(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    coupon_code: str
    user_email: Optional[str] = None
    redeemed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CouponRedeem(BaseModel):
    user_email: Optional[str] = None


class CouponValidationResponse(BaseModel):
    valid: bool
    reason: Optional[str] = None
    code: Optional[str] = None
    discount_type: Optional[DiscountType] = None
    discount_value: Optional[float] = None
    description: Optional[str] = None


# ============================================================
# Helpers
# ============================================================
def _gen_code(prefix: str = "", length: int = 8) -> str:
    alphabet = string.ascii_uppercase + string.digits
    raw = "".join(secrets.choice(alphabet) for _ in range(length))
    return f"{prefix}{raw}" if prefix else raw


def _serialize_dt(doc: dict) -> dict:
    """Convert datetime values to ISO strings for Mongo."""
    out = {}
    for k, v in doc.items():
        if isinstance(v, datetime):
            out[k] = v.isoformat()
        else:
            out[k] = v
    return out


def _deserialize_dt(doc: dict, fields: List[str]) -> dict:
    for f in fields:
        if f in doc and isinstance(doc[f], str):
            try:
                doc[f] = datetime.fromisoformat(doc[f])
            except Exception:
                pass
    return doc


async def _compute_referral_stats(code: str, reward_type: str, reward_value: float) -> ReferralStats:
    events = await db.referral_events.find({"referral_code": code}, {"_id": 0}).to_list(10000)
    clicks = sum(1 for e in events if e["event_type"] == "click")
    signups = sum(1 for e in events if e["event_type"] == "signup")
    conv_events = [e for e in events if e["event_type"] == "conversion"]
    conversions = len(conv_events)
    revenue = sum((e.get("amount") or 0.0) for e in conv_events)

    if reward_type == "percent":
        reward_earned = revenue * (reward_value / 100.0)
    elif reward_type == "fixed":
        reward_earned = conversions * reward_value
    elif reward_type == "month":
        reward_earned = conversions * reward_value  # months of free service
    else:  # credit
        reward_earned = conversions * reward_value

    return ReferralStats(
        code=code,
        clicks=clicks,
        signups=signups,
        conversions=conversions,
        revenue=round(revenue, 2),
        reward_earned=round(reward_earned, 2),
    )


# ============================================================
# Original endpoints
# ============================================================
@api_router.get("/")
async def root():
    return {"message": "PrioMail AI API", "version": "1.0"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = _serialize_dt(status_obj.model_dump())
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for c in status_checks:
        _deserialize_dt(c, ["timestamp"])
    return status_checks


# ============================================================
# Referral endpoints
# ============================================================
@api_router.post("/referrals", response_model=Referral)
async def create_referral(payload: ReferralCreate):
    code = (payload.code or "").strip().upper() or _gen_code()
    # Ensure unique
    existing = await db.referrals.find_one({"code": code})
    if existing:
        raise HTTPException(status_code=400, detail=f"Referral code '{code}' already exists")

    referral = Referral(
        code=code,
        owner_name=payload.owner_name,
        owner_email=payload.owner_email,
        reward_type=payload.reward_type,
        reward_value=payload.reward_value,
        notes=payload.notes or "",
    )
    doc = _serialize_dt(referral.model_dump())
    await db.referrals.insert_one(doc)
    return referral


@api_router.get("/referrals", response_model=List[ReferralWithStats])
async def list_referrals():
    referrals = await db.referrals.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    out: List[ReferralWithStats] = []
    for r in referrals:
        _deserialize_dt(r, ["created_at"])
        stats = await _compute_referral_stats(r["code"], r.get("reward_type", "percent"), r.get("reward_value", 0))
        out.append(ReferralWithStats(**r, stats=stats))
    return out


@api_router.get("/referrals/{code}", response_model=ReferralWithStats)
async def get_referral(code: str):
    code = code.upper()
    r = await db.referrals.find_one({"code": code}, {"_id": 0})
    if not r:
        raise HTTPException(status_code=404, detail="Referral not found")
    _deserialize_dt(r, ["created_at"])
    stats = await _compute_referral_stats(code, r.get("reward_type", "percent"), r.get("reward_value", 0))
    return ReferralWithStats(**r, stats=stats)


@api_router.patch("/referrals/{code}", response_model=Referral)
async def update_referral(code: str, payload: ReferralUpdate):
    code = code.upper()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.referrals.update_one({"code": code}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Referral not found")
    r = await db.referrals.find_one({"code": code}, {"_id": 0})
    _deserialize_dt(r, ["created_at"])
    return Referral(**r)


@api_router.delete("/referrals/{code}")
async def delete_referral(code: str):
    code = code.upper()
    result = await db.referrals.delete_one({"code": code})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Referral not found")
    # also delete events
    await db.referral_events.delete_many({"referral_code": code})
    return {"success": True, "message": f"Referral '{code}' deleted"}


@api_router.post("/referrals/{code}/events", response_model=ReferralEvent)
async def add_referral_event(code: str, payload: ReferralEventCreate):
    code = code.upper()
    referral = await db.referrals.find_one({"code": code}, {"_id": 0})
    if not referral:
        raise HTTPException(status_code=404, detail="Referral code not found")
    if not referral.get("active", True):
        raise HTTPException(status_code=400, detail="Referral is inactive")

    event = ReferralEvent(referral_code=code, **payload.model_dump())
    doc = _serialize_dt(event.model_dump())
    await db.referral_events.insert_one(doc)
    return event


@api_router.get("/referrals/{code}/events", response_model=List[ReferralEvent])
async def list_referral_events(code: str):
    code = code.upper()
    events = await db.referral_events.find({"referral_code": code}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    for e in events:
        _deserialize_dt(e, ["created_at"])
    return events


# ============================================================
# Coupon endpoints
# ============================================================
@api_router.post("/coupons", response_model=Coupon)
async def create_coupon(payload: CouponCreate):
    code = (payload.code or "").strip().upper() or _gen_code(prefix="SAVE", length=6)
    existing = await db.coupons.find_one({"code": code})
    if existing:
        raise HTTPException(status_code=400, detail=f"Coupon code '{code}' already exists")

    coupon = Coupon(
        code=code,
        description=payload.description or "",
        discount_type=payload.discount_type,
        discount_value=payload.discount_value,
        max_uses=payload.max_uses,
        valid_until=payload.valid_until,
        active=payload.active,
    )
    doc = _serialize_dt(coupon.model_dump())
    await db.coupons.insert_one(doc)
    return coupon


@api_router.get("/coupons", response_model=List[Coupon])
async def list_coupons():
    coupons = await db.coupons.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for c in coupons:
        _deserialize_dt(c, ["created_at", "valid_until"])
    return coupons


@api_router.get("/coupons/{code}", response_model=Coupon)
async def get_coupon(code: str):
    code = code.upper()
    c = await db.coupons.find_one({"code": code}, {"_id": 0})
    if not c:
        raise HTTPException(status_code=404, detail="Coupon not found")
    _deserialize_dt(c, ["created_at", "valid_until"])
    return Coupon(**c)


@api_router.patch("/coupons/{code}", response_model=Coupon)
async def update_coupon(code: str, payload: CouponUpdate):
    code = code.upper()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    # serialize datetime if present
    if "valid_until" in updates and isinstance(updates["valid_until"], datetime):
        updates["valid_until"] = updates["valid_until"].isoformat()
    result = await db.coupons.update_one({"code": code}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    c = await db.coupons.find_one({"code": code}, {"_id": 0})
    _deserialize_dt(c, ["created_at", "valid_until"])
    return Coupon(**c)


@api_router.delete("/coupons/{code}")
async def delete_coupon(code: str):
    code = code.upper()
    result = await db.coupons.delete_one({"code": code})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    await db.coupon_redemptions.delete_many({"coupon_code": code})
    return {"success": True, "message": f"Coupon '{code}' deleted"}


@api_router.post("/coupons/{code}/validate", response_model=CouponValidationResponse)
async def validate_coupon(code: str):
    code = code.upper()
    c = await db.coupons.find_one({"code": code}, {"_id": 0})
    if not c:
        return CouponValidationResponse(valid=False, reason="Coupon not found")
    _deserialize_dt(c, ["created_at", "valid_until"])
    if not c.get("active", True):
        return CouponValidationResponse(valid=False, reason="Coupon is inactive", code=code)
    if c.get("valid_until"):
        valid_until = c["valid_until"]
        if isinstance(valid_until, str):
            valid_until = datetime.fromisoformat(valid_until)
        if valid_until.tzinfo is None:
            valid_until = valid_until.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > valid_until:
            return CouponValidationResponse(valid=False, reason="Coupon expired", code=code)
    if c.get("max_uses") is not None and c["current_uses"] >= c["max_uses"]:
        return CouponValidationResponse(valid=False, reason="Coupon usage limit reached", code=code)

    return CouponValidationResponse(
        valid=True,
        code=code,
        discount_type=c["discount_type"],
        discount_value=c["discount_value"],
        description=c.get("description", ""),
    )


@api_router.post("/coupons/{code}/redeem")
async def redeem_coupon(code: str, payload: CouponRedeem):
    code = code.upper()
    # Re-validate first
    validation = await validate_coupon(code)
    if not validation.valid:
        raise HTTPException(status_code=400, detail=validation.reason or "Invalid coupon")

    # increment usage
    await db.coupons.update_one({"code": code}, {"$inc": {"current_uses": 1}})
    redemption = CouponRedemption(coupon_code=code, user_email=payload.user_email)
    doc = _serialize_dt(redemption.model_dump())
    await db.coupon_redemptions.insert_one(doc)
    return {
        "success": True,
        "redemption_id": redemption.id,
        "discount_type": validation.discount_type,
        "discount_value": validation.discount_value,
    }


@api_router.get("/coupons/{code}/redemptions", response_model=List[CouponRedemption])
async def list_coupon_redemptions(code: str):
    code = code.upper()
    reds = await db.coupon_redemptions.find({"coupon_code": code}, {"_id": 0}).sort("redeemed_at", -1).to_list(5000)
    for r in reds:
        _deserialize_dt(r, ["redeemed_at"])
    return reds


# ============================================================
# Admin overview
# ============================================================
@api_router.get("/admin/stats")
async def admin_stats():
    total_referrals = await db.referrals.count_documents({})
    active_referrals = await db.referrals.count_documents({"active": True})
    total_clicks = await db.referral_events.count_documents({"event_type": "click"})
    total_signups = await db.referral_events.count_documents({"event_type": "signup"})
    total_conversions = await db.referral_events.count_documents({"event_type": "conversion"})
    total_coupons = await db.coupons.count_documents({})
    active_coupons = await db.coupons.count_documents({"active": True})
    total_redemptions = await db.coupon_redemptions.count_documents({})

    # revenue aggregation
    pipeline = [
        {"$match": {"event_type": "conversion"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]
    rev_doc = await db.referral_events.aggregate(pipeline).to_list(1)
    total_revenue = rev_doc[0]["total"] if rev_doc else 0.0

    return {
        "referrals": {
            "total": total_referrals,
            "active": active_referrals,
            "clicks": total_clicks,
            "signups": total_signups,
            "conversions": total_conversions,
            "revenue": round(total_revenue or 0.0, 2),
        },
        "coupons": {
            "total": total_coupons,
            "active": active_coupons,
            "redemptions": total_redemptions,
        },
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
