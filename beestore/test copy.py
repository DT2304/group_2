from telethon import TelegramClient, events
import re

# Điền API ID và Hash của bạn ở đây
api_id = '21931615'  # Thay thế bằng API ID của bạn
api_hash = '6cd1f6260d0050adf4af5f1d99dbde09'  # Thay thế bằng API Hash của bạn

# Tạo Telegram client
client = TelegramClient('+84905227657', api_id, api_hash)

# Hàm xử lý khi nhận được tin nhắn từ kênh ID `777000`
@client.on(events.NewMessage(chats=777000))  # Chỉ lắng nghe tin nhắn từ 777000
async def handler(event):
    # In ra nội dung tin nhắn
    message_text = event.text
    print(f"Tin nhắn từ {event.sender_id}: {message_text}")

    # Tìm mã đăng nhập trong tin nhắn (nếu có)
    match = re.search(r'\b\d{5}\b', message_text)
    if match:
        code = match.group(0)
        print(f"Đã tìm thấy mã đăng nhập: {code}")

# Chạy client
async def main():
    await client.start()
    print("Đã đăng nhập thành công!")
    await client.run_until_disconnected()

client.loop.run_until_complete(main())
