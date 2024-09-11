# models.py
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask import Flask
from bson import ObjectId  # Thêm dòng này

app = Flask(__name__)
app.config.from_object('config.Config')
mongo = PyMongo(app)
bcrypt = Bcrypt(app)

def create_user(username, email, password, role='user'):
    if mongo.db.users.find_one({'username': username}):
        return {"error": "Username already exists"}

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    mongo.db.users.insert_one({
        'username': username,
        'email': email,
        'password': hashed_password,
        'role': role
    })
    return {"message": "User registered successfully"}

def create_product(title, price, description='', image='', rating=None):
    if rating is None:
        rating = {"rate": 0, "count": 0}

    mongo.db.products.insert_one({
        "title": title,
        "price": price,
        "description": description,
        "image": image,
        "rating": rating
    })
    return {"message": "Product added successfully"}

def get_product_by_id(product_id):
    product = mongo.db.products.find_one({'_id': ObjectId(product_id)})  # Sửa dòng này
    if product:
        return {
            "id": str(product["_id"]),
            "title": product["title"],
            "price": product["price"],
            "description": product["description"],
            "image": product["image"],
            "rating": product["rating"]
        }
    return {"error": "Product not found"}

def delete_product_by_id(product_id):
    result = mongo.db.products.delete_one({"_id": ObjectId(product_id)})  # Sửa dòng này
    if result.deleted_count > 0:
        return {"message": "Product deleted successfully"}
    return {"error": "Product not found"}

def update_or_add_cart_item(username, product_id, quantity):
    user = mongo.db.users.find_one({'username': username})
    if not user:
        return {"error": "User not found"}

    cart = mongo.db.carts.find_one({'username': username})
    if not cart:
        # Nếu giỏ hàng chưa tồn tại, tạo mới
        cart = {'username': username, 'products': []}

    # Tìm sản phẩm trong giỏ hàng
    product = next((item for item in cart.get('products', []) if item['id'] == product_id), None)
    
    if product:
        # Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        product['quantity'] += quantity
    else:
        # Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart['products'].append({'id': product_id, 'quantity': quantity})

    # Cập nhật hoặc tạo mới giỏ hàng trong database
    mongo.db.carts.update_one({'username': username}, {'$set': cart}, upsert=True)
    
    return {"message": "Cart updated successfully"}

def remove_from_cart(username, product_id):
    user = mongo.db.users.find_one({'username': username})
    if not user:
        return {"error": "User not found"}

    mongo.db.carts.update_one(
        {'username': username},
        {'$pull': {'products': product_id}}
    )
    return {"message": "Product removed from cart"}

def get_cart(username):
    user = mongo.db.users.find_one({'username': username})
    if not user:
        return {"error": "User not found"}

    cart = mongo.db.carts.find_one({'username': username})
    if not cart:
        return {"products": []}

    products = []
    for cart_item in cart.get('products', []):
        product = mongo.db.products.find_one({'_id': ObjectId(cart_item['id'])})
        if product:
            products.append({
                "id": str(product["_id"]),
                "title": product["title"],
                "price": product["price"],
                "description": product["description"],
                "image": product["image"],
                "rating": product["rating"],
                "quantity": cart_item['quantity']
            })
    return {"products": products}

def clear_cart(username):
    user = mongo.db.users.find_one({'username': username})
    if not user:
        return {"error": "User not found"}

    result = mongo.db.carts.delete_one({'username': username})
    if result.deleted_count > 0:
        return {"message": "Cart cleared"}
    else:
        return {"message": "Cart was already empty"}