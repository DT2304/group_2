import base64
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from config import Config
from models import (
    create_user,
    create_product,
    get_product_by_id,
    delete_product_by_id,
    update_or_add_cart_item,
    remove_from_cart,
    get_cart,
    clear_cart,
    search_products,
)
from utils import check_role
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)
mongo = PyMongo(app)
bcrypt = Bcrypt(app)


@app.after_request
def add_security_headers(response):
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; connect-src 'self' http://localhost:5000"
    )
    return response


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    result = create_user(data["username"], data["email"], data["password"])
    return jsonify(result)


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = mongo.db.users.find_one({"username": data.get("username")})
    
    if user and bcrypt.check_password_hash(user["password"], data["password"]):
        user_info = {
            "username": user["username"],
            "role": user.get("role", "user")
        }
        return jsonify({
            "message": "Đăng nhập thành công",
            "user": user_info
        }), 200

    return jsonify({"error": "Thông tin đăng nhập không hợp lệ"}), 401


@app.route("/products", methods=["POST"])
@check_role("admin")
def add_product():
    data = request.json
    result = create_product(
        data["title"],
        data["price"],
        data.get("description", ""),
        data.get("image", ""),
        data.get("rating"),
        data.get("colors", [])
    )
    return jsonify(result)


@app.route("/products", methods=["GET"])

def get_products():
    products = mongo.db.products.find()
    result = []
    for product in products:
        product_dict = {
            "id": str(product["_id"]),
            "title": product["title"],
            "price": product["price"],
            "description": product["description"],
            "rating": product["rating"],
            "colors": product.get("colors", [])
        }

        image_data = product.get("image")
        if image_data:
            if isinstance(image_data, dict) and "$binary" in image_data:
                base64_image = image_data["$binary"]["base64"]
                product_dict["image"] = f"data:image/jpeg;base64,{base64_image}"
            elif isinstance(image_data, bytes):
                base64_image = base64.b64encode(image_data).decode("utf-8")
                product_dict["image"] = f"data:image/jpeg;base64,{base64_image}"
            else:
                product_dict["image"] = ""
        else:
            product_dict["image"] = ""

        result.append(product_dict)

    return jsonify(result), 200


@app.route("/products/<product_id>", methods=["GET"])
def get_product(product_id):
    product = get_product_by_id(product_id)
    if "error" in product:
        return jsonify(product), 404
    return jsonify(product)


@app.route("/cart", methods=["PUT"])
def update_or_add_to_cart():
    data = request.json
    result = update_or_add_cart_item(
        data["username"], data["product_id"], data["color"], data["size"], data["quantity"]
    )
    return jsonify(result)


@app.route("/cart", methods=["DELETE"])
def remove_from_cart_route():
    data = request.json
    username = data.get("username")
    product_id = data.get("product_id")
    color = data.get("color")
    size = data.get("size")
    quantity = data.get("quantity")

    if not all([username, product_id, color, size]):

        return jsonify({"error": "Missing required parameters"}), 400

    result = remove_from_cart(username, product_id, color, size, quantity)
    return jsonify(result)

@app.route("/cart", methods=["GET"])
def view_cart():
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "Yêu cầu username"}), 400
    
    result = get_cart(username)
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]
    return jsonify(result), 200


@app.route("/checkout", methods=["POST"])
def checkout():
    data = request.json
    result = clear_cart(data["username"])
    return jsonify(result)


@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "")
    search_type = request.args.get("type", "long")
    
    if not query:
        return jsonify({"error": "Yêu cầu cung cấp từ khóa tìm kiếm"}), 400
    
    results = search_products(query, search_type)
    return jsonify(results), 200


if __name__ == "__main__":
    app.run(debug=True)