from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid
import json

app = FastAPI(title="WalmartConnect API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MODELS ────────────────────────────────────────────────────────────────────

class Task(BaseModel):
    id: Optional[str] = None
    title: str
    category: str
    priority: str  # high | medium | low
    status: str    # todo | inprogress | done
    assigneeId: str
    dueDate: str
    notes: Optional[str] = ""
    createdAt: Optional[str] = None
    completedAt: Optional[str] = None

class TaskStatusUpdate(BaseModel):
    status: str

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assigneeId: Optional[str] = None
    dueDate: Optional[str] = None
    notes: Optional[str] = None

# ── IN-MEMORY DB ──────────────────────────────────────────────────────────────

today = datetime.now().strftime("%Y-%m-%d")
yesterday = datetime.now().strftime("%Y-%m-%d")  # simplified

tasks_db: List[dict] = [
    {"id": "t1", "title": "Restock Aisle 4 — Breakfast Cereals", "category": "Restocking", "priority": "high", "status": "todo", "assigneeId": "u1", "dueDate": today, "notes": "Fill bottom shelf too", "createdAt": datetime.now().isoformat()},
    {"id": "t2", "title": "Price Check — Electronics Display", "category": "Price Check", "priority": "high", "status": "todo", "assigneeId": "u3", "dueDate": today, "notes": "", "createdAt": datetime.now().isoformat()},
    {"id": "t3", "title": "Clean Restroom — Zone B", "category": "Cleaning", "priority": "medium", "status": "todo", "assigneeId": "u4", "dueDate": today, "notes": "", "createdAt": datetime.now().isoformat()},
    {"id": "t4", "title": "Assist Self-Checkout Station 3", "category": "Customer Service", "priority": "medium", "status": "inprogress", "assigneeId": "u1", "dueDate": today, "notes": "", "createdAt": datetime.now().isoformat()},
    {"id": "t5", "title": "Cart Retrieval — Parking Zone C", "category": "Cart Retrieval", "priority": "low", "status": "inprogress", "assigneeId": "u2", "dueDate": today, "notes": "", "createdAt": datetime.now().isoformat()},
    {"id": "t6", "title": "Restock Beverages — Aisle 7", "category": "Restocking", "priority": "low", "status": "done", "assigneeId": "u2", "dueDate": today, "notes": "", "createdAt": datetime.now().isoformat(), "completedAt": datetime.now().isoformat()},
    {"id": "t7", "title": "Update Shelf Labels — Dairy Section", "category": "Inventory", "priority": "medium", "status": "done", "assigneeId": "u1", "dueDate": today, "notes": "", "createdAt": datetime.now().isoformat(), "completedAt": datetime.now().isoformat()},
]

# ── WEBSOCKET MANAGER ──────────────────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active_connections.append(ws)
        print(f"[WS] Client connected. Total: {len(self.active_connections)}")

    def disconnect(self, ws: WebSocket):
        if ws in self.active_connections:
            self.active_connections.remove(ws)
        print(f"[WS] Client disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, data: dict):
        msg = json.dumps(data)
        dead = []
        for ws in self.active_connections:
            try:
                await ws.send_text(msg)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

manager = ConnectionManager()

# ── ROUTES ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "WalmartConnect API running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok", "tasks": len(tasks_db)}

@app.get("/tasks", response_model=List[dict])
def get_tasks():
    return tasks_db

@app.get("/tasks/{task_id}")
def get_task(task_id: str):
    task = next((t for t in tasks_db if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/tasks", status_code=201)
async def create_task(task: Task):
    new_task = task.dict()
    new_task["id"] = "t_" + str(uuid.uuid4())[:8]
    new_task["createdAt"] = datetime.now().isoformat()
    tasks_db.append(new_task)
    await manager.broadcast({"event": "task_created", "task": new_task})
    return new_task

@app.patch("/tasks/{task_id}")
async def update_task(task_id: str, update: TaskUpdate):
    task = next((t for t in tasks_db if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    data = update.dict(exclude_none=True)
    task.update(data)
    await manager.broadcast({"event": "task_updated", "task": task})
    return task

@app.patch("/tasks/{task_id}/status")
async def update_status(task_id: str, update: TaskStatusUpdate):
    task = next((t for t in tasks_db if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task["status"] = update.status
    if update.status == "done":
        task["completedAt"] = datetime.now().isoformat()
    await manager.broadcast({"event": "task_status_changed", "taskId": task_id, "status": update.status})
    return task

@app.delete("/tasks/{task_id}", status_code=204)
async def delete_task(task_id: str):
    global tasks_db
    task = next((t for t in tasks_db if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    tasks_db = [t for t in tasks_db if t["id"] != task_id]
    await manager.broadcast({"event": "task_deleted", "taskId": task_id})
    return None

@app.get("/stats")
def get_stats():
    today_str = datetime.now().strftime("%Y-%m-%d")
    return {
        "total": len(tasks_db),
        "inProgress": len([t for t in tasks_db if t["status"] == "inprogress"]),
        "completed": len([t for t in tasks_db if t["status"] == "done"]),
        "overdue": len([t for t in tasks_db if t.get("dueDate", "") < today_str and t["status"] != "done"]),
    }

# ── WEBSOCKET ──────────────────────────────────────────────────────────────────

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        # Send current state on connect
        await ws.send_text(json.dumps({"event": "init", "tasks": tasks_db}))
        while True:
            data = await ws.receive_text()
            msg = json.loads(data)
            # Echo back with broadcast
            await manager.broadcast({"event": "message", "data": msg})
    except WebSocketDisconnect:
        manager.disconnect(ws)
