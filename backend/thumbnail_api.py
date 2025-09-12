#!/usr/bin/env python3
"""
Thumbnail Management API for Junior News Digest
==============================================

API endpoints for managing story thumbnails:
- Generate thumbnails for stories
- Regenerate thumbnails
- Get thumbnail status
- Upload custom thumbnails
"""

from flask import Blueprint, request, jsonify, send_file
import os
import json
from pathlib import Path
from thumbnail_generator import ThumbnailGenerator
import logging

# Setup logging
logger = logging.getLogger(__name__)

# Create blueprint
thumbnail_bp = Blueprint('thumbnail', __name__)

# Initialize thumbnail generator
thumbnail_generator = ThumbnailGenerator()

@thumbnail_bp.route('/api/thumbnails/generate', methods=['POST'])
def generate_thumbnails():
    """Generate thumbnails for stories"""
    try:
        data = request.get_json()
        stories = data.get('stories', [])
        
        if not stories:
            return jsonify({'error': 'No stories provided'}), 400
        
        # Generate thumbnails
        results = thumbnail_generator.batch_generate_thumbnails(stories)
        
        return jsonify({
            'success': True,
            'generated': len(results),
            'thumbnails': results
        })
        
    except Exception as e:
        logger.error(f"Error generating thumbnails: {e}")
        return jsonify({'error': str(e)}), 500

@thumbnail_bp.route('/api/thumbnails/generate/<story_id>', methods=['POST'])
def generate_single_thumbnail(story_id):
    """Generate thumbnail for a single story"""
    try:
        data = request.get_json()
        story = data.get('story', {})
        
        if not story:
            return jsonify({'error': 'Story data required'}), 400
        
        # Generate thumbnail
        result = thumbnail_generator.generate_thumbnail_for_story(story)
        
        if result:
            return jsonify({
                'success': True,
                'thumbnail_path': result,
                'story_id': story_id
            })
        else:
            return jsonify({'error': 'Failed to generate thumbnail'}), 500
            
    except Exception as e:
        logger.error(f"Error generating thumbnail for {story_id}: {e}")
        return jsonify({'error': str(e)}), 500

@thumbnail_bp.route('/api/thumbnails/status', methods=['GET'])
def get_thumbnail_status():
    """Get status of all thumbnails"""
    try:
        thumbnails_dir = Path("thumbnails")
        thumbnails_dir.mkdir(exist_ok=True)
        
        # Get all thumbnail files
        thumbnail_files = list(thumbnails_dir.glob("*.jpg"))
        
        status = {
            'total_thumbnails': len(thumbnail_files),
            'thumbnails': []
        }
        
        for thumb_file in thumbnail_files:
            story_id = thumb_file.stem
            file_size = thumb_file.stat().st_size
            status['thumbnails'].append({
                'story_id': story_id,
                'filename': thumb_file.name,
                'size_bytes': file_size,
                'exists': True
            })
        
        return jsonify({
            'success': True,
            'status': status
        })
        
    except Exception as e:
        logger.error(f"Error getting thumbnail status: {e}")
        return jsonify({'error': str(e)}), 500

@thumbnail_bp.route('/api/thumbnails/regenerate', methods=['POST'])
def regenerate_thumbnails():
    """Regenerate thumbnails for stories (force new generation)"""
    try:
        data = request.get_json()
        story_ids = data.get('story_ids', [])
        stories = data.get('stories', [])
        
        if not story_ids and not stories:
            return jsonify({'error': 'Story IDs or stories required'}), 400
        
        results = {}
        
        # If stories provided, use them directly
        if stories:
            for story in stories:
                story_id = story.get('id')
                if story_id:
                    # Remove existing thumbnail
                    existing_thumb = Path("thumbnails") / f"{story_id}.jpg"
                    if existing_thumb.exists():
                        existing_thumb.unlink()
                    
                    # Generate new thumbnail
                    result = thumbnail_generator.generate_thumbnail_for_story(story)
                    if result:
                        results[story_id] = result
        
        # If only story IDs provided, fetch stories from database
        elif story_ids:
            # This would need to be integrated with your database
            # For now, return error
            return jsonify({'error': 'Story data required for regeneration'}), 400
        
        return jsonify({
            'success': True,
            'regenerated': len(results),
            'thumbnails': results
        })
        
    except Exception as e:
        logger.error(f"Error regenerating thumbnails: {e}")
        return jsonify({'error': str(e)}), 500

@thumbnail_bp.route('/api/thumbnails/upload', methods=['POST'])
def upload_custom_thumbnail():
    """Upload custom thumbnail for a story"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        story_id = request.form.get('story_id')
        
        if not story_id:
            return jsonify({'error': 'Story ID required'}), 400
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        if not file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            return jsonify({'error': 'Invalid file type. Only JPG and PNG allowed.'}), 400
        
        # Save uploaded file
        thumbnails_dir = Path("thumbnails")
        thumbnails_dir.mkdir(exist_ok=True)
        
        filename = f"{story_id}.jpg"
        filepath = thumbnails_dir / filename
        
        # Process and save image
        from PIL import Image
        img = Image.open(file.stream)
        img = img.convert('RGB')
        img = img.resize((400, 300), Image.Resampling.LANCZOS)
        img.save(filepath, 'JPEG', quality=85)
        
        return jsonify({
            'success': True,
            'thumbnail_path': str(filepath),
            'story_id': story_id
        })
        
    except Exception as e:
        logger.error(f"Error uploading thumbnail: {e}")
        return jsonify({'error': str(e)}), 500

@thumbnail_bp.route('/api/thumbnails/delete/<story_id>', methods=['DELETE'])
def delete_thumbnail(story_id):
    """Delete thumbnail for a story"""
    try:
        thumbnails_dir = Path("thumbnails")
        filepath = thumbnails_dir / f"{story_id}.jpg"
        
        if filepath.exists():
            filepath.unlink()
            return jsonify({
                'success': True,
                'message': f'Thumbnail deleted for story {story_id}'
            })
        else:
            return jsonify({
                'success': False,
                'message': f'Thumbnail not found for story {story_id}'
            }), 404
            
    except Exception as e:
        logger.error(f"Error deleting thumbnail for {story_id}: {e}")
        return jsonify({'error': str(e)}), 500

@thumbnail_bp.route('/api/thumbnails/analyze/<story_id>', methods=['POST'])
def analyze_story_for_thumbnail(story_id):
    """Analyze story content for thumbnail generation suggestions"""
    try:
        data = request.get_json()
        story = data.get('story', {})
        
        if not story:
            return jsonify({'error': 'Story data required'}), 400
        
        # Analyze story
        analysis = thumbnail_generator.analyze_story_for_thumbnail(story)
        
        return jsonify({
            'success': True,
            'story_id': story_id,
            'analysis': analysis
        })
        
    except Exception as e:
        logger.error(f"Error analyzing story {story_id}: {e}")
        return jsonify({'error': str(e)}), 500
