from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import sqlite3

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database setup
def get_db_connection():
    conn = sqlite3.connect('grocery_store.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)')
    conn.execute('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, description TEXT)')
    conn.close()

init_db()

# Pydantic models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    name: str
    email: str
    password: str

class UserInDB(User):
    id: int

class Product(BaseModel):
    id: Optional[int] = None
    name: str
    price: float
    description: Optional[str] = None

class Order(BaseModel):
    items: List[int]

# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(email: str):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    if user:
        return UserInDB(**dict(user))

def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
async def register(user: User):
    conn = get_db_connection()
    hashed_password = get_password_hash(user.password)
    try:
        conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                     (user.name, user.email, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        conn.close()
    return {"msg": "User registered successfully"}

@app.get("/api/products", response_model=List[Product])
async def get_products(page: int = Query(0), limit: int = Query(10)):
    offset = page * limit
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM products LIMIT ? OFFSET ?', (limit, offset)).fetchall()
    conn.close()
    return [dict(ix) for ix in products]

@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    conn = get_db_connection()
    product = conn.execute('SELECT * FROM products WHERE id = ?', (product_id,)).fetchone()
    conn.close()
    if product:
        return dict(product)
    raise HTTPException(status_code=404, detail="Product not found")

@app.post("/api/products", response_model=Product, status_code=status.HTTP_201_CREATED)
async def add_product(product: Product, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
                   (product.name, product.price, product.description))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    product.id = new_id
    return product

@app.put("/api/products/{product_id}", response_model=Product)
async def update_product(product_id: int, product: Product, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    conn.execute('UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?',
                 (product.name, product.price, product.description, product_id))
    conn.commit()
    updated_product = conn.execute('SELECT * FROM products WHERE id = ?', (product_id,)).fetchone()
    conn.close()
    if updated_product:
        return dict(updated_product)
    raise HTTPException(status_code=404, detail="Product not found")

@app.delete("/api/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.execute('DELETE FROM products WHERE id = ?', (product_id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Product not found")

@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
async def create_order(order: Order, current_user: User = Depends(get_current_user)):
    # Here you would typically save the order to a database
    # For simplicity, we're just returning a success message
    return {"msg": "Order placed successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)