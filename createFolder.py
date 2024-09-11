import os

# Định nghĩa cấu trúc thư mục
structure = {
    "backend": {
        "app.py": None,
        "config.py": None,
        "models.py": None,
        "routes": {
            "__init__.py": None,
            "auth.py": None,
            "product.py": None,
            "cart.py": None
        },
        "utils": {
            "helpers.py": None
        }
    }
}

def create_structure(base_path, structure):
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if content is None:
            # Tạo tệp tin
            open(path, 'w').close()
        else:
            # Tạo thư mục và tiếp tục tạo cấu trúc bên trong
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)

# Tạo cấu trúc thư mục
create_structure('.', structure)
