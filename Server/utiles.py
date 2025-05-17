from motor.motor_asyncio import AsyncIOMotorClient

# Use the actual MongoDB URI you provided
MONGO_URI = "mongodb://localhost:27017/healme"

# Create a client and get the "healme" database
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_default_database()  # This will be "healme"
