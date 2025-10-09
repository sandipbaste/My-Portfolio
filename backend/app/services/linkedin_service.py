import requests
import os

class LinkedInService:
    def __init__(self):
        self.access_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
        self.base_url = "https://api.linkedin.com/v2"
    
    def get_profile_data(self):
        """Fetch LinkedIn profile data"""
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        # Get basic profile info
        profile_response = requests.get(
            f"{self.base_url}/me",
            headers=headers
        )
        
        # Get profile with additional fields
        profile_fields_response = requests.get(
            f"{self.base_url}/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline,vanityName,emailAddress,location)",
            headers=headers
        )
        
        return profile_fields_response.json()
    
    def get_experience(self):
        """Fetch work experience"""
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{self.base_url}/me?projection=(experiences)",
            headers=headers
        )
        
        return response.json()