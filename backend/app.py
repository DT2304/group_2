# app.py
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from config import Config
from models import create_user, create_product, get_product_by_id, delete_product_by_id, update_or_add_cart_item, remove_from_cart, get_cart, clear_cart
from utils import check_role
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows requests from any origin

app.config.from_object(Config)
mongo = PyMongo(app)
bcrypt = Bcrypt(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    result = create_user(data['username'], data['email'], data['password'])
    return jsonify(result)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = mongo.db.users.find_one({'username': data.get('username')})
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/products', methods=['POST'])
@check_role('admin')
def add_product():
    data = request.json
    result = create_product(data['title'], data['price'], data.get('description', ''), data.get('image', ''), data.get('rating'))
    return jsonify(result)

@app.route('/products', methods=['GET'])
def get_products():
    products = mongo.db.products.find()
    result = []
    for product in products:
        result.append({
            "id": str(product["_id"]),
            "title": product["title"],
            "price": product["price"],
            "description": product["description"],
            "image": product["image"],
            "rating": product["rating"]
        })
    return jsonify(result), 200

@app.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    product = get_product_by_id(product_id)
    if "error" in product:
        return jsonify(product), 404
    return jsonify(product)


@app.route('/cart', methods=['POST'])
def add_to_cart_route():
    data = request.json
    result = update_or_add_cart_item(data['username'], data['product_id'], 1)  # Mặc định thêm 1 sản phẩm
    return jsonify(result)

@app.route('/cart', methods=['PUT'])
def update_or_add_to_cart():
    data = request.json
    result = update_or_add_cart_item(data['username'], data['product_id'], data['quantity'])
    return jsonify(result)

@app.route('/cart', methods=['DELETE'])
def remove_from_cart_route():
    data = request.json
    result = remove_from_cart(data['username'], data['product_id'])
    return jsonify(result)

@app.route('/cart', methods=['GET'])
def view_cart():
    username = request.args.get('username')
    result = get_cart(username)
    return jsonify(result)

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.json
    result = clear_cart(data['username'])
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
