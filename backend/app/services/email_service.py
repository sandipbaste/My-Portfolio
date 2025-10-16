import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.sender_email = os.getenv("SENDER_EMAIL", "sandipbaste999@gmail.com")
        self.sender_password = os.getenv("SENDER_PASSWORD", "")
        
    async def send_contact_email(self, name: str, email: str, message: str) -> bool:
        """Send email notification for contact form submission"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = self.sender_email  # Send to yourself
            msg['Subject'] = f"📧 New Contact Form Submission from {name}"
            
            # Create email body
            body = f"""
            🎉 New contact form submission received from your portfolio website!
            
            👤 Contact Details:
            • Name: {name}
            • Email: {email}
            
            💬 Message:
            {message}
            
            ---
            This message was automatically sent from your portfolio website contact form.
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            text = msg.as_string()
            server.sendmail(self.sender_email, self.sender_email, text)
            server.quit()
            
            print(f"✅ Contact email sent to you for: {email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending contact email: {e}")
            return False
    
    async def send_auto_reply(self, to_email: str, name: str) -> bool:
        """Send auto-reply to the person who filled the form"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = to_email
            msg['Subject'] = "Thank you for contacting Sandip Baste - AI/ML Developer"
            
            body = f"""
            Dear {name},
            
            Thank you for reaching out through my portfolio website! 
            I have received your message and will get back to you as soon as possible.
            
            In the meantime, feel free to explore my:
            • GitHub: https://github.com/sandipbaste
            • LinkedIn: linkedin.com/in/sandipbaste999
            • Projects: https://github.com/sandipbaste?tab=repositories
            
            Best regards,
            Sandip Baste
            AI/ML Developer
            
            📧 Email: sandipbaste999@gmail.com
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            text = msg.as_string()
            server.sendmail(self.sender_email, to_email, text)
            server.quit()
            
            print(f"✅ Auto-reply sent to: {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending auto-reply: {e}")
            return False