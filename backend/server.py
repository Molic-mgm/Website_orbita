import from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import requests
import asyncio
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN = "8569545038:AAHY_--IrLtpQBtpEGr3G9XfY4nDAhEN5Ug"
TELEGRAM_CHAT_ID = "-1003419846362"

# Admin credentials
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBasic()

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class QuoteRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str


class Quote(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    ip_address: Optional[str] = None
    country: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "new"  # new, in_progress, completed


class ProjectCreate(BaseModel):
    title: str
    description: str
    tech: List[str]
    image: str
    link: Optional[str] = None


class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    tech: List[str]
    image: str
    link: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class QuoteStatusUpdate(BaseModel):
    status: str


# Helper function to verify admin credentials
def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return credentials.username


# Helper function to get country from IP
def get_country_from_ip(ip_address: str) -> str:
    """Get country name from IP address using ip-api.com"""
    if not ip_address or ip_address == "127.0.0.1":
        return "Unknown"
    
    try:
        response = requests.get(f"http://ip-api.com/json/{ip_address}?fields=country", timeout=3)
        if response.status_code == 200:
            data = response.json()
            return data.get('country', 'Unknown')
    except Exception as e:
        logger.error(f"Error getting country from IP: {e}")
    
    return "Unknown"


# Helper function to send Telegram notification
async def send_telegram_notification(quote: Quote):
    """Send quote notification to Telegram chat"""
    try:
        message = f"""🔔 <b>Новая заявка!</b>

👤 <b>Имя:</b> {quote.name}
📧 <b>Email:</b> {quote.email}
📱 <b>Телефон:</b> {quote.phone or 'Не указан'}
💬 <b>Сообщение:</b>
{quote.message}

🌍 <b>Страна:</b> {quote.country}
🌐 <b>IP:</b> {quote.ip_address}
📅 <b>Дата:</b> {quote.created_at.strftime('%d.%m.%Y %H:%M:%S UTC')}
"""
        
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "HTML"
        }
        
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: requests.post(url, json=payload, timeout=5)
        )
        logger.info(f"Telegram notification sent for quote {quote.id}")
    except Exception as e:
        logger.error(f"Error sending Telegram notification: {e}")


# Public routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


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


@api_router.post("/quote")
async def create_quote(quote_request: QuoteRequest, request: Request):
    """Create a new quote request and send notification to Telegram"""
    try:
        client_ip = request.client.host
        if "x-forwarded-for" in request.headers:
            client_ip = request.headers["x-forwarded-for"].split(",")[0].strip()
        
        country = get_country_from_ip(client_ip)
        user_agent = request.headers.get("user-agent", "Unknown")
        
        quote = Quote(
            name=quote_request.name,
            email=quote_request.email,
            phone=quote_request.phone,
            message=quote_request.message,
            ip_address=client_ip,
            country=country,
            user_agent=user_agent
        )
        
        doc = quote.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.quotes.insert_one(doc)
        
        asyncio.create_task(send_telegram_notification(quote))
        
        logger.info(f"Quote created: {quote.id} from {quote.email}")
        
        return {
            "success": True,
            "message": "Заявка успешно отправлена",
            "quote_id": quote.id
        }
    except Exception as e:
        logger.error(f"Error creating quote: {e}")
        return {
            "success": False,
            "message": "Ошибка при отправке заявки"
        }


@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    """Get all projects"""
    projects = await db.projects.find({}, {"_id": 0}).to_list(1000)
    
    for project in projects:
        if isinstance(project['created_at'], str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
    
    return projects


# Admin routes
@api_router.post("/admin/login")
async def admin_login(login_request: AdminLoginRequest):
    """Admin login"""
    if login_request.username == ADMIN_USERNAME and login_request.password == ADMIN_PASSWORD:
        return {
            "success": True,
            "message": "Login successful",
            "username": login_request.username
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@api_router.get("/admin/quotes", response_model=List[Quote])
async def get_all_quotes(username: str = Depends(verify_admin)):
    """Get all quotes (admin only)"""
    quotes = await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for quote in quotes:
        if isinstance(quote['created_at'], str):
            quote['created_at'] = datetime.fromisoformat(quote['created_at'])
    
    return quotes


@api_router.patch("/admin/quotes/{quote_id}/status")
async def update_quote_status(quote_id: str, status_update: QuoteStatusUpdate, username: str = Depends(verify_admin)):
    """Update quote status (admin only)"""
    result = await db.quotes.update_one(
        {"id": quote_id},
        {"$set": {"status": status_update.status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    return {"success": True, "message": "Status updated"}


@api_router.delete("/admin/quotes/{quote_id}")
async def delete_quote(quote_id: str, username: str = Depends(verify_admin)):
    """Delete a quote (admin only)"""
    result = await db.quotes.delete_one({"id": quote_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    return {"success": True, "message": "Quote deleted"}


@api_router.get("/admin/projects", response_model=List[Project])
async def get_all_projects_admin(username: str = Depends(verify_admin)):
    """Get all projects (admin only)"""
    projects = await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for project in projects:
        if isinstance(project['created_at'], str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
    
    return projects


@api_router.post("/admin/projects", response_model=Project)
async def create_project(project_data: ProjectCreate, username: str = Depends(verify_admin)):
    """Create a new project (admin only)"""
    project = Project(**project_data.model_dump())
    
    doc = project.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.projects.insert_one(doc)
    logger.info(f"Project created: {project.id}")
    
    return project


@api_router.put("/admin/projects/{project_id}")
async def update_project(project_id: str, project_data: ProjectCreate, username: str = Depends(verify_admin)):
    """Update a project (admin only)"""
    update_data = project_data.model_dump()
    
    result = await db.projects.update_one(
        {"id": project_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"success": True, "message": "Project updated"}


@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, username: str = Depends(verify_admin)):
    """Delete a project (admin only)"""
    result = await db.projects.delete_one({"id": project_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"success": True, "message": "Project deleted"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
