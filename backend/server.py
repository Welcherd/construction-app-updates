from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import hashlib
import secrets
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', secrets.token_hex(32))
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create the main app without a prefix
app = FastAPI(title="ConstructionConnection API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== MODELS ====================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# User Models
class Address(BaseModel):
    street: str
    city: str
    state: str
    country: str
    zip_code: str
    is_primary: bool = False

class Location(BaseModel):
    lat: float
    lng: float
    city: Optional[str] = None
    country: Optional[str] = None

class UserRegistration(BaseModel):
    username: str
    email: EmailStr
    password: str
    company: Optional[str] = None
    role: str = "worker"  # worker, contractor, equipment_owner, project_manager
    expertise_level: str = "intermediate"  # beginner, intermediate, professional
    addresses: List[Address] = []
    interests: List[str] = []  # modern, sustainable, classical, industrial, etc.
    tools: List[str] = []  # autocad, revit, sketchup, etc.
    project_types: List[str] = []  # residential, commercial, infrastructure, industrial
    specializations: List[str] = []  # electrical, plumbing, structural, etc.
    certifications: List[str] = []
    years_experience: int = 0
    bio: Optional[str] = None
    phone: Optional[str] = None
    country: str = "US"
    location: Optional[Location] = None
    consent_data_sharing: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    username: str
    email: str
    company: Optional[str] = None
    role: str
    expertise_level: str
    addresses: List[Address] = []
    interests: List[str] = []
    tools: List[str] = []
    project_types: List[str] = []
    specializations: List[str] = []
    certifications: List[str] = []
    years_experience: int = 0
    bio: Optional[str] = None
    phone: Optional[str] = None
    country: str
    location: Optional[Location] = None
    avatar_url: Optional[str] = None
    rating: float = 0.0
    reviews_count: int = 0
    projects_completed: int = 0
    created_at: datetime
    last_login: Optional[datetime] = None
    is_verified: bool = False
    is_active: bool = True

class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    company: Optional[str] = None
    expertise_level: Optional[str] = None
    addresses: Optional[List[Address]] = None
    interests: Optional[List[str]] = None
    tools: Optional[List[str]] = None
    project_types: Optional[List[str]] = None
    specializations: Optional[List[str]] = None
    certifications: Optional[List[str]] = None
    years_experience: Optional[int] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    location: Optional[Location] = None
    avatar_url: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

class UserListResponse(BaseModel):
    users: List[UserProfile]
    total: int
    page: int
    per_page: int


# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return hash_password(password) == hashed

def create_token(user_id: str, email: str) -> str:
    """Create a JWT token"""
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expiration,
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get the current authenticated user"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = decode_token(credentials.credentials)
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password": 0})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

async def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
    """Get the current user if authenticated, otherwise return None"""
    if not credentials:
        return None
    try:
        payload = decode_token(credentials.credentials)
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password": 0})
        return user
    except:
        return None

def user_doc_to_profile(user_doc: dict) -> UserProfile:
    """Convert a user document to UserProfile"""
    # Ensure datetime fields
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    if isinstance(user_doc.get('last_login'), str):
        user_doc['last_login'] = datetime.fromisoformat(user_doc['last_login'])
    
    return UserProfile(**user_doc)


# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register_user(user_data: UserRegistration):
    """Register a new user"""
    # Check if email already exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username already exists
    existing_username = await db.users.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user document
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    
    user_doc = {
        "id": user_id,
        "username": user_data.username,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "company": user_data.company,
        "role": user_data.role,
        "expertise_level": user_data.expertise_level,
        "addresses": [addr.model_dump() for addr in user_data.addresses],
        "interests": user_data.interests,
        "tools": user_data.tools,
        "project_types": user_data.project_types,
        "specializations": user_data.specializations,
        "certifications": user_data.certifications,
        "years_experience": user_data.years_experience,
        "bio": user_data.bio,
        "phone": user_data.phone,
        "country": user_data.country,
        "location": user_data.location.model_dump() if user_data.location else None,
        "consent_data_sharing": user_data.consent_data_sharing,
        "avatar_url": None,
        "rating": 0.0,
        "reviews_count": 0,
        "projects_completed": 0,
        "created_at": now.isoformat(),
        "last_login": now.isoformat(),
        "is_verified": False,
        "is_active": True
    }
    
    await db.users.insert_one(user_doc)
    
    # Create token
    token = create_token(user_id, user_data.email)
    
    # Return response without password
    user_doc.pop("password")
    user_doc.pop("_id", None)
    
    return TokenResponse(
        access_token=token,
        user=user_doc_to_profile(user_doc)
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login_user(credentials: UserLogin):
    """Login a user"""
    user = await db.users.find_one({"email": credentials.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is deactivated")
    
    # Update last login
    now = datetime.now(timezone.utc)
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"last_login": now.isoformat()}}
    )
    user["last_login"] = now.isoformat()
    
    # Create token
    token = create_token(user["id"], user["email"])
    
    # Return response without password
    user.pop("password")
    user.pop("_id", None)
    
    return TokenResponse(
        access_token=token,
        user=user_doc_to_profile(user)
    )

@api_router.get("/auth/me", response_model=UserProfile)
async def get_current_user_profile(user: dict = Depends(get_current_user)):
    """Get current user's profile"""
    return user_doc_to_profile(user)

@api_router.post("/auth/logout")
async def logout_user(user: dict = Depends(get_current_user)):
    """Logout user (client should discard token)"""
    return {"message": "Logged out successfully"}


# ==================== USER PROFILE ROUTES ====================

@api_router.put("/users/me", response_model=UserProfile)
async def update_profile(
    updates: UserProfileUpdate,
    user: dict = Depends(get_current_user)
):
    """Update current user's profile"""
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    
    if "addresses" in update_data:
        update_data["addresses"] = [
            addr if isinstance(addr, dict) else addr.model_dump() 
            for addr in update_data["addresses"]
        ]
    
    if update_data:
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": update_data}
        )
    
    # Fetch updated user
    updated_user = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password": 0})
    return user_doc_to_profile(updated_user)

@api_router.delete("/users/me")
async def delete_account(user: dict = Depends(get_current_user)):
    """Delete current user's account"""
    await db.users.delete_one({"id": user["id"]})
    return {"message": "Account deleted successfully"}

@api_router.get("/users/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    """Get a user's public profile"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_doc_to_profile(user)

@api_router.get("/users", response_model=UserListResponse)
async def list_users(
    page: int = 1,
    per_page: int = 20,
    role: Optional[str] = None,
    country: Optional[str] = None,
    expertise: Optional[str] = None,
    specialization: Optional[str] = None,
    search: Optional[str] = None
):
    """List users with filters and pagination"""
    query = {"is_active": True}
    
    if role:
        query["role"] = role
    if country:
        query["country"] = country
    if expertise:
        query["expertise_level"] = expertise
    if specialization:
        query["specializations"] = {"$in": [specialization]}
    if search:
        query["$or"] = [
            {"username": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}},
            {"bio": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await db.users.count_documents(query)
    
    # Get paginated results
    skip = (page - 1) * per_page
    users_cursor = db.users.find(query, {"_id": 0, "password": 0}).skip(skip).limit(per_page)
    users = await users_cursor.to_list(per_page)
    
    return UserListResponse(
        users=[user_doc_to_profile(u) for u in users],
        total=total,
        page=page,
        per_page=per_page
    )


# ==================== EXISTING ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "ConstructionConnection API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ==================== WORKERS MAP ROUTES ====================

class WorkerMapItem(BaseModel):
    id: str
    username: str
    company: Optional[str] = None
    role: str
    expertise_level: str
    specializations: List[str] = []
    years_experience: int = 0
    rating: float = 0.0
    projects_completed: int = 0
    location: Location
    avatar_url: Optional[str] = None

class WorkersMapResponse(BaseModel):
    workers: List[WorkerMapItem]
    total: int

@api_router.get("/workers/map", response_model=WorkersMapResponse)
async def get_workers_for_map(
    role: Optional[str] = None,
    specialization: Optional[str] = None,
    min_experience: int = 0,
    min_rating: float = 0.0
):
    """Get workers with location data for map display"""
    query = {
        "is_active": True,
        "location": {"$ne": None}
    }
    
    if role:
        query["role"] = role
    if specialization:
        query["specializations"] = {"$in": [specialization]}
    if min_experience > 0:
        query["years_experience"] = {"$gte": min_experience}
    if min_rating > 0:
        query["rating"] = {"$gte": min_rating}
    
    workers_cursor = db.users.find(
        query,
        {
            "_id": 0,
            "id": 1,
            "username": 1,
            "company": 1,
            "role": 1,
            "expertise_level": 1,
            "specializations": 1,
            "years_experience": 1,
            "rating": 1,
            "projects_completed": 1,
            "location": 1,
            "avatar_url": 1
        }
    ).limit(500)
    
    workers = await workers_cursor.to_list(500)
    
    return WorkersMapResponse(
        workers=[WorkerMapItem(**w) for w in workers if w.get("location")],
        total=len(workers)
    )

@api_router.put("/users/me/location")
async def update_user_location(
    location: Location,
    user: dict = Depends(get_current_user)
):
    """Update current user's location"""
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"location": location.model_dump()}}
    )
    return {"message": "Location updated successfully", "location": location}


# ==================== APP SETUP ====================

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create indexes on startup
@app.on_event("startup")
async def create_indexes():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("username", unique=True)
    await db.users.create_index("role")
    await db.users.create_index("country")
    await db.users.create_index("expertise_level")
    await db.users.create_index("specializations")
    logger.info("Database indexes created")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
