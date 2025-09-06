#!/usr/bin/env python3
"""
Junior News Digest - Production Deployment Configuration
Handles all deployment settings and environment setup
"""

import os
from pathlib import Path
from dataclasses import dataclass
from typing import Dict, List, Optional

@dataclass
class DeploymentConfig:
    """Configuration for production deployment"""
    
    # Environment settings
    environment: str = "production"
    debug: bool = False
    
    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 5000
    api_workers: int = 4
    
    # Database settings
    database_url: str = "postgresql://user:password@localhost/junior_news"
    database_pool_size: int = 20
    database_max_overflow: int = 30
    
    # Storage settings
    upload_folder: str = "/var/uploads"
    video_storage: str = "/var/videos"
    max_file_size: int = 500 * 1024 * 1024  # 500MB
    
    # Content generation settings
    story_generation_enabled: bool = True
    video_generation_enabled: bool = True
    quiz_generation_enabled: bool = True
    
    # External services
    elevenlabs_api_key: str = ""
    leonardo_api_key: str = ""
    news_api_key: str = ""
    
    # Security settings
    jwt_secret_key: str = ""
    allowed_origins: List[str] = None
    
    # Performance settings
    cache_timeout: int = 300  # 5 minutes
    rate_limit_per_minute: int = 100
    
    # Logging settings
    log_level: str = "INFO"
    log_file: str = "/var/log/junior_news.log"
    
    def __post_init__(self):
        if self.allowed_origins is None:
            self.allowed_origins = ["https://juniornewsdigest.com"]
        
        # Load from environment variables
        self.load_from_env()
    
    def load_from_env(self):
        """Load configuration from environment variables"""
        self.api_port = int(os.getenv('PORT', self.api_port))
        self.database_url = os.getenv('DATABASE_URL', self.database_url)
        self.elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY', '')
        self.leonardo_api_key = os.getenv('LEONARDO_API_KEY', '')
        self.news_api_key = os.getenv('NEWS_API_KEY', '')
        self.jwt_secret_key = os.getenv('JWT_SECRET_KEY', 'change-this-in-production')
        
        # Storage paths
        self.upload_folder = os.getenv('UPLOAD_FOLDER', self.upload_folder)
        self.video_storage = os.getenv('VIDEO_STORAGE', self.video_storage)
        
        # Create directories if they don't exist
        os.makedirs(self.upload_folder, exist_ok=True)
        os.makedirs(self.video_storage, exist_ok=True)

# Production deployment settings
PRODUCTION_CONFIG = DeploymentConfig()

# Development settings (override for local development)
DEVELOPMENT_CONFIG = DeploymentConfig(
    environment="development",
    debug=True,
    api_host="localhost",
    database_url="sqlite:///development.db",
    upload_folder="./uploads",
    video_storage="./generated_videos",
    allowed_origins=["http://localhost:3000", "http://localhost:8081"],
    log_level="DEBUG"
)

def get_config(environment: str = None) -> DeploymentConfig:
    """Get configuration based on environment"""
    if environment is None:
        environment = os.getenv('ENVIRONMENT', 'production')
    
    if environment.lower() == 'development':
        return DEVELOPMENT_CONFIG
    else:
        return PRODUCTION_CONFIG

# Docker configuration
DOCKER_CONFIG = {
    "image_name": "junior-news-digest",
    "container_name": "junior-news-api",
    "ports": {
        "api": 5000,
        "database": 5432
    },
    "volumes": {
        "uploads": "/var/uploads",
        "videos": "/var/videos",
        "logs": "/var/log"
    },
    "environment_variables": [
        "ELEVENLABS_API_KEY",
        "LEONARDO_API_KEY", 
        "NEWS_API_KEY",
        "JWT_SECRET_KEY",
        "DATABASE_URL"
    ]
}

# Kubernetes configuration
K8S_CONFIG = {
    "namespace": "junior-news",
    "replicas": 3,
    "resources": {
        "requests": {
            "memory": "512Mi",
            "cpu": "250m"
        },
        "limits": {
            "memory": "1Gi",
            "cpu": "500m"
        }
    },
    "ingress": {
        "host": "api.juniornewsdigest.com",
        "tls": True
    }
}

# App Store deployment settings
APP_STORE_CONFIG = {
    "app_name": "Junior News Digest",
    "bundle_id": "com.juniornews.digest",
    "version": "1.0.0",
    "build_number": "1",
    "minimum_ios_version": "13.0",
    "minimum_android_version": "21",
    "categories": ["Education", "News"],
    "keywords": [
        "kids news",
        "educational",
        "children",
        "current events",
        "learning",
        "safe news"
    ],
    "description": {
        "short": "Safe, educational news for kids aged 6-12",
        "long": """Junior News Digest delivers age-appropriate news content designed specifically for children aged 6-12. Our AI-powered system curates and simplifies current events, making them engaging and educational while maintaining safety standards.

Features:
• Age-appropriate news articles
• Interactive quizzes for comprehension
• Educational videos with cartoon illustrations
• Dark/Light mode support
• Offline reading capability
• Parental controls and safety features
• Progress tracking and achievements

Junior News Digest helps children stay informed about the world around them while developing critical thinking skills and media literacy in a safe, controlled environment."""
    },
    "privacy_policy_url": "https://juniornewsdigest.com/privacy",
    "terms_of_service_url": "https://juniornewsdigest.com/terms",
    "support_url": "https://juniornewsdigest.com/support"
}

# Content moderation settings
CONTENT_MODERATION = {
    "age_appropriateness_threshold": 0.8,
    "violence_filter": True,
    "profanity_filter": True,
    "adult_content_filter": True,
    "scary_content_filter": True,
    "positive_tone_requirement": True,
    "educational_value_threshold": 0.7,
    "reading_level": "grade_3_to_6",
    "max_article_length": 500,  # words
    "required_categories": [
        "Science",
        "Technology", 
        "Environment",
        "Education",
        "Health",
        "Space",
        "Animals",
        "Sports"
    ],
    "blocked_categories": [
        "Politics",
        "Crime",
        "Disasters",
        "War",
        "Adult Content"
    ]
}

# Monitoring and analytics
MONITORING_CONFIG = {
    "health_check_interval": 30,  # seconds
    "performance_metrics": True,
    "error_tracking": True,
    "user_analytics": {
        "enabled": True,
        "privacy_compliant": True,
        "data_retention_days": 90
    },
    "content_metrics": {
        "track_reading_time": True,
        "track_engagement": True,
        "track_quiz_performance": True
    },
    "alerts": {
        "error_rate_threshold": 5,  # percent
        "response_time_threshold": 2000,  # milliseconds
        "disk_usage_threshold": 80  # percent
    }
}

def generate_docker_compose():
    """Generate docker-compose.yml for deployment"""
    return f"""
version: '3.8'

services:
  api:
    image: {DOCKER_CONFIG['image_name']}
    container_name: {DOCKER_CONFIG['container_name']}
    ports:
      - "{DOCKER_CONFIG['ports']['api']}:5000"
    volumes:
      - {DOCKER_CONFIG['volumes']['uploads']}:{DOCKER_CONFIG['volumes']['uploads']}
      - {DOCKER_CONFIG['volumes']['videos']}:{DOCKER_CONFIG['volumes']['videos']}
      - {DOCKER_CONFIG['volumes']['logs']}:{DOCKER_CONFIG['volumes']['logs']}
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=${{DATABASE_URL}}
      - ELEVENLABS_API_KEY=${{ELEVENLABS_API_KEY}}
      - LEONARDO_API_KEY=${{LEONARDO_API_KEY}}
      - NEWS_API_KEY=${{NEWS_API_KEY}}
      - JWT_SECRET_KEY=${{JWT_SECRET_KEY}}
    depends_on:
      - database
    restart: unless-stopped

  database:
    image: postgres:15
    container_name: junior-news-db
    ports:
      - "{DOCKER_CONFIG['ports']['database']}:5432"
    environment:
      - POSTGRES_DB=junior_news
      - POSTGRES_USER=${{DB_USER}}
      - POSTGRES_PASSWORD=${{DB_PASSWORD}}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: junior-news-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  postgres_data:
"""

def generate_kubernetes_manifest():
    """Generate Kubernetes deployment manifest"""
    return f"""
apiVersion: apps/v1
kind: Deployment
metadata:
  name: junior-news-api
  namespace: {K8S_CONFIG['namespace']}
spec:
  replicas: {K8S_CONFIG['replicas']}
  selector:
    matchLabels:
      app: junior-news-api
  template:
    metadata:
      labels:
        app: junior-news-api
    spec:
      containers:
      - name: api
        image: {DOCKER_CONFIG['image_name']}:latest
        ports:
        - containerPort: 5000
        resources:
          requests:
            memory: {K8S_CONFIG['resources']['requests']['memory']}
            cpu: {K8S_CONFIG['resources']['requests']['cpu']}
          limits:
            memory: {K8S_CONFIG['resources']['limits']['memory']}
            cpu: {K8S_CONFIG['resources']['limits']['cpu']}
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: junior-news-secrets
              key: database-url
        - name: ELEVENLABS_API_KEY
          valueFrom:
            secretKeyRef:
              name: junior-news-secrets
              key: elevenlabs-api-key
        - name: LEONARDO_API_KEY
          valueFrom:
            secretKeyRef:
              name: junior-news-secrets
              key: leonardo-api-key
        - name: JWT_SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: junior-news-secrets
              key: jwt-secret-key

---
apiVersion: v1
kind: Service
metadata:
  name: junior-news-api-service
  namespace: {K8S_CONFIG['namespace']}
spec:
  selector:
    app: junior-news-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: junior-news-ingress
  namespace: {K8S_CONFIG['namespace']}
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - {K8S_CONFIG['ingress']['host']}
    secretName: junior-news-tls
  rules:
  - host: {K8S_CONFIG['ingress']['host']}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: junior-news-api-service
            port:
              number: 80
"""

if __name__ == "__main__":
    # Generate deployment files
    config = get_config()
    print(f"Configuration loaded for {config.environment} environment")
    
    # Write docker-compose.yml
    with open("docker-compose.yml", "w") as f:
        f.write(generate_docker_compose())
    print("Generated docker-compose.yml")
    
    # Write kubernetes manifest
    with open("k8s-manifest.yaml", "w") as f:
        f.write(generate_kubernetes_manifest())
    print("Generated k8s-manifest.yaml")
    
    print("\nDeployment configuration ready!")
    print(f"API will run on {config.api_host}:{config.api_port}")
    print(f"Upload folder: {config.upload_folder}")
    print(f"Video storage: {config.video_storage}")
