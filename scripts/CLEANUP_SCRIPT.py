#!/usr/bin/env python3
"""
Project Cleanup and Organization Script
=====================================

This script reorganizes the Junior News Digest project into a clean, 
production-ready structure and removes unused files.
"""

import os
import shutil
from pathlib import Path

def cleanup_project():
    """Clean up and organize the project structure"""
    
    print("🧹 Starting project cleanup and organization...")
    
    # Define what to keep and where to put it
    keep_structure = {
        'backend/': [
            'production/backend_api.py',
            'production/database_manager.py', 
            'production/add_content.py',
            'production/bulk_content_loader.py',
            'production/content_admin.py',
            'production/editorial_workflow.py',
            'production/weekly_scheduler.py',
            'production/requirements.txt',
            'production/CONTENT_MANAGEMENT_GUIDE.md',
            'production/EDITORIAL_WORKFLOW_GUIDE.md'
        ],
        'app/': [
            'app_development/kids_news_app_fixed/'
        ],
        'assets/': [
            'OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png',
            'assets/'
        ],
        'deployment/': [
            'render.yaml',
            'RENDER_DEPLOY_GUIDE.md'
        ],
        'docs/': [
            'production/CONTENT_MANAGEMENT_GUIDE.md',
            'production/EDITORIAL_WORKFLOW_GUIDE.md',
            'RENDER_DEPLOY_GUIDE.md'
        ]
    }
    
    # Directories to delete completely
    delete_dirs = [
        '_archive_netlify',
        '_archive_newsletters', 
        '_cleanup_archive',
        'junior-news-working',
        'kids_news_content',
        'legacy_development',
        'production_files',
        'scripts',
        'similar_logos',
        'temp_final_video',
        'temp_official_video',
        'temp_ultimate_video', 
        'temp_video_generation',
        'tools',
        'video_logo_options'
    ]
    
    # Files to delete
    delete_files = [
        'API_SETUP_GUIDE.md',
        'CARTOON_ILLUSTRATIONS_UPDATE.md',
        'CLEANED_PROJECT_STRUCTURE.md',
        'COMPLETE_INTEGRATION_SUCCESS.md',
        'COMPLIANCE_AUDIT_CHECKLIST.md',
        'COMPREHENSIVE_APPLICATION_GUIDELINES.md',
        'FINAL_PROJECT_STRUCTURE.md',
        'final_video.mp4',
        'generate_video.py',
        'package.tmp.json',
        'PROJECT_STRUCTURE.md',
        'run_complete_system.py',
        'Screenshot 2025-08-07 at 16.56.44.png',
        'weekly_content_system.log'
    ]
    
    # Create new directory structure
    new_dirs = ['backend', 'app', 'assets', 'deployment', 'docs', 'archive']
    for dir_name in new_dirs:
        os.makedirs(dir_name, exist_ok=True)
        print(f"✅ Created directory: {dir_name}")
    
    # Move archive directories
    archive_dirs = ['_cleanup_archive', 'legacy_development', 'kids_news_content']
    for dir_name in archive_dirs:
        if os.path.exists(dir_name):
            shutil.move(dir_name, f'archive/{dir_name}')
            print(f"📦 Archived: {dir_name}")
    
    # Delete unnecessary directories
    for dir_name in delete_dirs:
        if os.path.exists(dir_name) and dir_name not in archive_dirs:
            shutil.rmtree(dir_name)
            print(f"🗑️ Deleted directory: {dir_name}")
    
    # Delete unnecessary files
    for file_name in delete_files:
        if os.path.exists(file_name):
            os.remove(file_name)
            print(f"🗑️ Deleted file: {file_name}")
    
    print("✅ Project cleanup completed!")
    print("\n📁 New project structure:")
    print("   backend/     - All backend code and APIs")
    print("   app/         - React Native application")
    print("   assets/      - Images, logos, and media")
    print("   deployment/  - Deployment configurations")
    print("   docs/        - Documentation")
    print("   archive/     - Archived old code")

if __name__ == '__main__':
    cleanup_project()
