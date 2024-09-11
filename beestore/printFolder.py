import os

def print_directory_tree(startpath, level=0):
    prefix = " " * (level * 4)
    for item in os.listdir(startpath):
        path = os.path.join(startpath, item)
        print(f"{prefix}|__ {item}")
        if os.path.isdir(path):
            print_directory_tree(path, level + 1)

# Gọi hàm với đường dẫn thư mục cần vẽ
print_directory_tree(r'C:\Users\hoang\OneDrive\Máy tính\CS 434\beestore\src')
