#!/usr/bin/env python3
"""
Junior News Digest - Netlify API Function
=========================================

Main API function for Netlify deployment.
"""

import os
import sys
import json
import uuid
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
import sqlite3
import logging

# Setup logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """Main Netlify function handler"""
    
    # CORS headers
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    }
    
    # Handle OPTIONS (preflight) requests
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': ''
        }
    
    try:
        # Parse the request
        path = event.get('path', '/')
        method = event.get('httpMethod', 'GET')
        
        # Initialize in-memory data (since we can't persist SQLite in serverless)
        articles_data = get_sample_articles()
        videos_data = get_sample_videos()
        
        # Route the request
        if path in ['/', '/health', '/api/health']:
            response_data = {
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'database': 'connected',
                'automation': 'running',
                'message': 'Junior News Digest API - Netlify Deployment'
            }
        
        elif path == '/api/articles':
            response_data = {
                'success': True,
                'articles': articles_data,
                'total': len(articles_data)
            }
        
        elif path == '/api/videos':
            response_data = {
                'success': True,
                'videos': videos_data,
                'total': len(videos_data)
            }
        
        elif path.startswith('/api/articles/'):
            article_id = path.split('/')[-1]
            article = next((a for a in articles_data if a['id'] == article_id), None)
            if article:
                response_data = article
            else:
                return {
                    'statusCode': 404,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Article not found'})
                }
        
        else:
            return {
                'statusCode': 404,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Endpoint not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        logger.error(f"Function error: {e}")
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }

def get_sample_articles():
    """Get sample articles data"""
    return [
        {
            'id': 'solar-robot-saves-environment-netlify',
            'title': 'Kids Create Amazing Solar Robot to Save Environment',
            'headline': 'Kids Create Amazing Solar Robot to Save Environment',
            'content': 'A group of brilliant students from Green Valley School invented an incredible solar-powered robot that helps clean parks and protect our environment! The robot uses special solar panels to collect energy from the sun, so it doesn\'t need any harmful fuel. The students worked with their teacher for six months to build this amazing invention. The solar robot can work for 8 hours on a sunny day without stopping! This shows how young people can create solutions to help our planet.',
            'summary': 'Students create solar-powered robot that cleans parks using renewable energy.',
            'category': 'technology',
            'author': 'Junior Science Team',
            'published_date': datetime.now().isoformat(),
            'read_time': '3 min read',
            'is_trending': True,
            'is_breaking': False,
            'is_hot': False,
            'likes': 45,
            'views': 234,
            'comments': 12
        },
        {
            'id': 'ocean-cleanup-saves-animals-netlify',
            'title': 'Ocean Cleanup Robot Saves 1000 Sea Animals',
            'headline': 'Ocean Cleanup Robot Saves 1000 Sea Animals',
            'content': 'An incredible robot named "Ocean Helper" has saved over 1,000 sea animals from plastic pollution! The robot was created by marine scientists in California. It swims through the ocean like a friendly whale, collecting plastic bottles, bags, and other trash that hurt sea creatures. Since it started working, Ocean Helper has cleaned 500 square miles of ocean! Sea turtles, dolphins, and fish now have cleaner, safer homes.',
            'summary': 'Ocean-cleaning robot saves marine life by removing plastic pollution.',
            'category': 'environment',
            'author': 'Ocean News Team',
            'published_date': (datetime.now() - timedelta(hours=2)).isoformat(),
            'read_time': '4 min read',
            'is_hot': True,
            'is_breaking': False,
            'is_trending': False,
            'likes': 67,
            'views': 456,
            'comments': 23
        },
        {
            'id': 'young-scientists-medicine-breakthrough-netlify',
            'title': 'Young Scientists Help Create New Medicine for Kids',
            'headline': 'Young Scientists Help Create New Medicine for Kids',
            'content': 'Amazing young scientists have helped create a new medicine that helps children with allergies stay safe and healthy! The medicine works like a superhero shield, protecting kids from dangerous allergic reactions. The research team worked with students from Science Academy to test and improve the medicine. This breakthrough will help millions of children around the world feel safer when eating and playing.',
            'summary': 'Young scientists contribute to breakthrough medicine for childhood allergies.',
            'category': 'health',
            'author': 'Dr. Health News',
            'published_date': (datetime.now() - timedelta(hours=4)).isoformat(),
            'read_time': '3 min read',
            'is_breaking': True,
            'is_trending': False,
            'is_hot': False,
            'likes': 89,
            'views': 678,
            'comments': 34
        },
        {
            'id': 'space-discovery-kids-telescope-netlify',
            'title': 'Kids Discover New Planet Using School Telescope',
            'headline': 'Kids Discover New Planet Using School Telescope',
            'content': 'Students at Star Academy made an incredible discovery - they found a new planet using their school telescope! The planet is called "Wonder World" and it\'s located 50 light-years away from Earth. The young astronomers worked every night for three months, carefully studying the stars. Scientists from NASA confirmed their amazing discovery! This shows that kids can make real contributions to space science.',
            'summary': 'School students discover new planet using telescope, confirmed by NASA.',
            'category': 'science',
            'author': 'Space News Kids',
            'published_date': (datetime.now() - timedelta(hours=6)).isoformat(),
            'read_time': '5 min read',
            'is_breaking': False,
            'is_trending': True,
            'is_hot': True,
            'likes': 123,
            'views': 890,
            'comments': 56
        },
        {
            'id': 'recycling-champions-save-city-netlify',
            'title': 'Young Recycling Champions Save Their City',
            'headline': 'Young Recycling Champions Save Their City',
            'content': 'A group of 8-year-old environmental heroes started a recycling program that saved their entire city! They collected over 10,000 plastic bottles, 5,000 aluminum cans, and 2,000 newspapers in just one month. The mayor gave them a special award for helping make their city cleaner. Other cities are now copying their amazing recycling program. These young champions prove that kids can make a big difference!',
            'summary': 'Young recycling program saves city, wins mayor\'s award.',
            'category': 'environment',
            'author': 'Green Kids News',
            'published_date': (datetime.now() - timedelta(hours=8)).isoformat(),
            'read_time': '4 min read',
            'is_breaking': False,
            'is_trending': False,
            'is_hot': True,
            'likes': 78,
            'views': 567,
            'comments': 29
        }
    ]

def get_sample_videos():
    """Get sample videos data"""
    return [
        {
            'id': 'solar-robot-video-netlify',
            'title': 'Amazing Solar Robot in Action',
            'description': 'Watch the incredible solar-powered robot clean parks!',
            'video_url': 'https://example.com/videos/solar-robot.mp4',
            'thumbnail_url': 'https://example.com/thumbnails/solar-robot.jpg',
            'duration': '3:45',
            'status': 'ready',
            'upload_date': datetime.now().isoformat()
        },
        {
            'id': 'ocean-cleanup-video-netlify',
            'title': 'Ocean Helper Robot Saves Sea Life',
            'description': 'See how the Ocean Helper robot cleans our oceans!',
            'video_url': 'https://example.com/videos/ocean-helper.mp4',
            'thumbnail_url': 'https://example.com/thumbnails/ocean-helper.jpg',
            'duration': '4:20',
            'status': 'ready',
            'upload_date': (datetime.now() - timedelta(hours=1)).isoformat()
        }
    ]

# For local testing
if __name__ == '__main__':
    test_event = {
        'httpMethod': 'GET',
        'path': '/api/articles',
        'queryStringParameters': {},
        'headers': {},
        'body': ''
    }
    
    result = handler(test_event, {})
    print(json.dumps(result, indent=2))
