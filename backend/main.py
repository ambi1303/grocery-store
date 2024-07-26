from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import sqlite3

# Security constants
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost","http://192.168.1.29:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
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
    conn.execute('CREATE TABLE IF NOT EXISTS cart_items (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, product_id INTEGER, quantity INTEGER)')
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

class CartItem(BaseModel):
    product_id: int
    quantity: int

class Cart(BaseModel):
    items: List[CartItem]

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
    except JWTError as e:
        print(f"JWT ERROR: {str(e)}")
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
async def get_products(page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    offset = (page - 1) * limit
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

@app.options("/api/cart")
async def options_cart():
    return {"Allow": "GET, POST, DELETE, OPTIONS"}

@app.post("/api/cart", status_code=status.HTTP_201_CREATED)
async def create_or_update_cart(cart: Cart, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Delete existing cart items for the user
        cursor.execute('DELETE FROM cart_items WHERE user_id=?', (current_user.id,))

        # Insert new cart items
        for item in cart.items:
            cursor.execute('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                           (current_user.id, item.product_id, item.quantity))

        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()
    return {"msg": "Cart updated successfully"}

@app.get("/api/cart", response_model=Cart)
async def get_cart(current_user: User = Depends(get_current_user)):
    print(f"User attempting to access cart: {current_user.email}")
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        items = cursor.execute('SELECT product_id, quantity FROM cart_items WHERE user_id=?', (current_user.id,)).fetchall()
        return Cart(items=[CartItem(product_id=item['product_id'], quantity=item['quantity']) for item in items])
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        conn.close()

@app.delete("/api/cart", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM cart_items WHERE user_id=?', (current_user.id,))
        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@app.post("/api/checkout", status_code=status.HTTP_201_CREATED)
async def checkout(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    try:
        # Here you would typically process the order
        # For simplicity, we're just clearing the cart
        conn.execute('DELETE FROM cart_items WHERE user_id = ?', (current_user.id,))
        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()
    return {"msg": "Order placed successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)