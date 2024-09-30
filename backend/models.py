from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask import Flask
from bson import ObjectId
import base64

app = Flask(__name__)
app.config.from_object("config.Config")
mongo = PyMongo(app)
bcrypt = Bcrypt(app)


def create_user(username, email, password, role="user"):
    # Kiểm tra xem username đã tồn tại chưa
    if mongo.db.users.find_one({"username": username}):
        return {"error": "Tên người dùng đã tồn tại"}

    # Kiểm tra xem email đã tồn tại chưa
    if mongo.db.users.find_one({"email": email}):
        return {"error": "Email đã được sử dụng"}

    # Nếu cả username và email đều chưa tồn tại, tiến hành tạo user mới
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    mongo.db.users.insert_one(
        {
            "username": username,
            "email": email,
            "password": hashed_password,
            "role": role,
        }
    )
    return {"message": "Đăng ký người dùng thành công"}


# sửa
def create_product(title, price, description="", image=None, rating=None, colors=None):
    if rating is None:
        rating = {"rate": 0, "count": 0}

    if colors is None:
        colors = []

    product_data = {
        "title": title,
        "price": price,
        "description": description,
        "rating": rating,
        "colors": colors,
    }

    if image:
        if isinstance(image, str):
            product_data["image"] = {"$binary": {"base64": image, "subType": "00"}}
        elif isinstance(image, bytes):
            product_data["image"] = {
                "$binary": {
                    "base64": base64.b64encode(image).decode("utf-8"),
                    "subType": "00",
                }
            }

    new_product = mongo.db.products.insert_one(product_data)
    return {
        "message": "Sản phẩm đã được thêm thành công",
        "id": str(new_product.inserted_id),
    }


def get_product_by_id(product_id):
    product = mongo.db.products.find_one({"_id": ObjectId(product_id)})
    if product:
        product_dict = {
            "id": str(product["_id"]),
            "title": product["title"],
            "price": product["price"],
            "description": product["description"],
            "rating": product["rating"],
            "colors": product.get("colors", []),
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

        return product_dict
    return {"error": "Không tìm thấy sản phẩm"}


def delete_product_by_id(product_id):
    result = mongo.db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count > 0:
        return {"message": "Sản phẩm đã được xóa thành công"}
    return {"error": "Không tìm thấy sản phẩm"}


def update_or_add_cart_item(username, product_id, color, size, quantity):
    try:
        cart = mongo.db.carts.find_one({"username": username})
        if not cart:
            cart = {"username": username, "products": []}

        product = next(
            (item for item in cart.get("products", []) if item["id"] == product_id),
            None,
        )

        if product:
            color_item = next(
                (c for c in product["colors"] if c["color"] == color),
                None,
            )
            if color_item:
                size_item = next(
                    (s for s in color_item["sizes"] if s["size"] == size), None
                )
                if size_item:
                    size_item["quantity"] += quantity
                else:
                    color_item["sizes"].append({"size": size, "quantity": quantity})
            else:
                product["colors"].append(
                    {"color": color, "sizes": [{"size": size, "quantity": quantity}]}
                )
        else:
            cart["products"].append(
                {
                    "id": product_id,
                    "colors": [
                        {
                            "color": color,
                            "sizes": [{"size": size, "quantity": quantity}],
                        }
                    ],
                }
            )

        mongo.db.carts.update_one({"username": username}, {"$set": cart}, upsert=True)

        return {"message": "Giỏ hàng đã được cập nhật thành công"}
    except Exception as e:
        print(f"Error in update_or_add_cart_item: {str(e)}")
        return {"error": "Đã xảy ra lỗi khi cập nhật giỏ hàng"}


def remove_from_cart(username, product_id, color, size, quantity=None):
    try:
        cart = mongo.db.carts.find_one({"username": username})
        if not cart:
            return {"error": "Giỏ hàng không tồn tại"}, 404

        products = cart.get("products", [])

        product = None
        
        for item in products:

            if item["id"] == product_id:
                product = item 
                break

        if not product:
            print(product)
            return {"error": "Sản phẩm không tồn tại trong giỏ hàng"}, 404

        color_item = next(
            (c for c in product["colors"] if c["color"] == color),
            None,
        )

        if not color_item:
            return {"error": "Màu sắc sản phẩm không tồn tại trong giỏ hàng"}, 404

        size_item = next((s for s in color_item["sizes"] if s["size"] == size), None)
        if not size_item:
            return {"error": "Kích thước sản phẩm không tồn tại trong giỏ hàng"}, 404

        if quantity is not None:
            new_qty = max(0, size_item["quantity"] - quantity)
            if new_qty > 0:
                size_item["quantity"] = new_qty
            else:
                color_item["sizes"] = [
                    s for s in color_item["sizes"] if s["size"] != size
                ]
        else:
            color_item["sizes"] = [s for s in color_item["sizes"] if s["size"] != size]

        if not color_item["sizes"]:
            product["colors"] = [c for c in product["colors"] if c["color"] != color]

        if not product["colors"]:
            cart["products"] = [p for p in cart["products"] if p["id"] != product_id]

        mongo.db.carts.update_one({"username": username}, {"$set": cart})

        return {"message": "Giỏ hàng đã được cập nhật thành công"}
    except Exception as e:
        print(f"Error: {e}")
        return {"error": f"Đã xảy ra lỗi khi cập nhật giỏ hàng: {str(e)}"}, 500


def get_cart(username):
    user = mongo.db.users.find_one({"username": username})
    if not user:
        return {"error": "User not found"}, 404

    cart = mongo.db.carts.find_one({"username": username})
    if not cart:
        return {"products": []}

    # Flatten the structure for easier frontend handling
    flattened_products = []
    for product in cart.get("products", []):
        for color_item in product["colors"]:
            for size_item in color_item["sizes"]:
                flattened_products.append(
                    {
                        "id": product["id"],
                        "color": color_item["color"],
                        "size": size_item["size"],
                        "quantity": size_item["quantity"],
                    }
                )

    return {"products": flattened_products}


def clear_cart(username):
    result = mongo.db.carts.delete_one({"username": username})
    if result.deleted_count > 0:
        return {"message": "Giỏ hàng đã được xóa"}
    else:
        return {"message": "Giỏ hàng đã trống"}


def search_products(query, search_type="long"):
    mongo_query = {
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"description": {"$regex": query, "$options": "i"}},
        ]
    }

    limit = 5 if search_type == "less" else 0

    results = mongo.db.products.find(mongo_query).limit(limit)

    products = []
    for product in results:
        product_dict = {
            "id": str(product["_id"]),
            "title": product["title"],
            "price": product["price"],
            "description": product["description"],
            "rating": product["rating"],
            "colors": product.get("colors", []),
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

        products.append(product_dict)

    return products
