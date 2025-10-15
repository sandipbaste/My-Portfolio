import mysql.connector
import os
from typing import Optional
import asyncio
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.host = os.getenv("MYSQL_HOST", "MYSQL_HOST")
        self.user = os.getenv("MYSQL_USER", "MYSQL_USER")
        self.password = os.getenv("MYSQL_PASSWORD", "MYSQL_PASSWORD")
        self.database = os.getenv("MYSQL_DATABASE", "MYSQL_DATABASE")
        self.port = os.getenv("MYSQL_PORT", "MYSQL_PORT")
        
    def get_connection(self):
        try:
            return mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                port=int(self.port)
            )
        except mysql.connector.Error as e:
            print(f"❌ Database connection error: {e}")
            return None
    
    def initialize_database(self):
        """Initialize database and create tables if they don't exist"""
        try:
            # First connect without database to create it
            conn = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                port=int(self.port)
            )
            cursor = conn.cursor()
            
            # Create database if it doesn't exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.database}")
            cursor.execute(f"USE {self.database}")
            
            # Create chat_messages table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chat_messages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    session_id VARCHAR(255) NOT NULL,
                    user_message TEXT NOT NULL,
                    bot_response TEXT NOT NULL,
                    user_ip VARCHAR(45),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_session_id (session_id),
                    INDEX idx_created_at (created_at)
                )
            """)
            
            # Create contact_submissions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS contact_submissions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    user_ip VARCHAR(45),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_email (email),
                    INDEX idx_created_at (created_at)
                )
            """)
            
            conn.commit()
            cursor.close()
            conn.close()
            print("✅ Database initialized successfully")
            
        except Exception as e:
            print(f"❌ Error initializing database: {e}")

# Global database instance
db = Database()

async def save_chat_message(session_id: str, user_message: str, bot_response: str, user_ip: Optional[str] = None):
    """Save chat message to database"""
    try:
        conn = db.get_connection()
        if not conn:
            return False
            
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO chat_messages (session_id, user_message, bot_response, user_ip)
            VALUES (%s, %s, %s, %s)
        """, (session_id, user_message, bot_response, user_ip))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"✅ Chat message saved for session: {session_id}")
        return True
        
    except Exception as e:
        print(f"❌ Error saving chat message: {e}")
        return False

async def save_contact_form(name: str, email: str, message: str, user_ip: Optional[str] = None):
    """Save contact form submission to database"""
    try:
        conn = db.get_connection()
        if not conn:
            return None
            
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO contact_submissions (name, email, message, user_ip)
            VALUES (%s, %s, %s, %s)
        """, (name, email, message, user_ip))
        
        conn.commit()
        contact_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        print(f"✅ Contact form saved for: {email}")
        return contact_id
        
    except Exception as e:
        print(f"❌ Error saving contact form: {e}")
        return None

# Initialize database when module is imported
db.initialize_database()