# 📰 Editorial Workflow System
## Junior News Digest - Complete Guide

This system automates the weekly editorial workflow for Junior News Digest, from story generation to publication.

## 🔄 **Weekly Workflow Overview**

### **Sunday: Story Generation**
- **9:00 AM**: System automatically generates 15-20 candidate stories
- **Editor receives notification** to review stories
- **Stories cover**: Technology, Science, Environment, Health, Education, Sports, Culture

### **Editor Review Process**
- **Access Review Portal**: http://localhost:5002
- **Review each story**: Read content, check quality, assess kid-friendliness
- **Make decisions**: Approve, Reject, or Edit stories
- **Add notes**: Provide feedback and editing instructions

### **Content Processing**
- **Approved stories** are automatically processed
- **Articles created** in the main database
- **Videos generated** (placeholder for future integration)
- **Quizzes created** (placeholder for future integration)

### **Weekly Distribution**
- **Monday**: 1/3 of approved content published
- **Wednesday**: 1/3 of approved content published  
- **Friday**: 1/3 of approved content published

## 🛠️ **System Components**

### **1. Editorial Workflow Engine** (`editorial_workflow.py`)
- **Story Generation**: Creates candidate stories using templates
- **Review Management**: Tracks story approval status
- **Content Processing**: Converts approved stories to articles
- **Scheduling**: Plans weekly content distribution

### **2. Weekly Scheduler** (`weekly_scheduler.py`)
- **Automated Tasks**: Runs scheduled operations
- **Cron Integration**: Sets up automated execution
- **Notification System**: Alerts editors of important events
- **Status Monitoring**: Tracks workflow progress

### **3. Review Portal** (Web Interface)
- **Story Display**: Shows all candidate stories with metadata
- **Approval Interface**: One-click approve/reject buttons
- **Editor Notes**: Add feedback and editing instructions
- **Progress Tracking**: Visual status of review process

## 📅 **Getting Started**

### **Initial Setup**
```bash
cd production

# Make scripts executable
chmod +x editorial_workflow.py weekly_scheduler.py

# Install dependencies (if needed)
pip3 install flask requests
```

### **Sunday: Generate Stories**
```bash
# Generate 20 candidate stories for the week
python3 editorial_workflow.py generate-candidates --count 20

# Check what was generated
python3 editorial_workflow.py status
```

### **Start Review Portal**
```bash
# Start the web interface for story review
python3 editorial_workflow.py review-portal

# Visit http://localhost:5002 in your browser
```

### **Process Approved Stories**
```bash
# After editor approval, process all approved stories
python3 editorial_workflow.py process-approved

# Schedule content for the week (Mon/Wed/Fri)
python3 editorial_workflow.py schedule-week
```

## 🔧 **Automated Setup**

### **Set Up Cron Jobs**
```bash
# See recommended cron schedule
python3 weekly_scheduler.py --setup-cron

# Add to your crontab
crontab -e
```

### **Recommended Cron Schedule**
```bash
# Sunday 9:00 AM: Generate candidate stories
0 9 * * 0 cd /path/to/production && python3 weekly_scheduler.py --run-today

# Mon/Wed/Fri 8:00 AM: Publish scheduled content
0 8 * * 1,3,5 cd /path/to/production && python3 weekly_scheduler.py --run-today

# Daily 6:00 PM: Check for pending tasks
0 18 * * * cd /path/to/production && python3 weekly_scheduler.py --check-schedule
```

## 📋 **Daily Operations**

### **Check Today's Tasks**
```bash
python3 weekly_scheduler.py --check-schedule
```

### **Run Today's Tasks**
```bash
python3 weekly_scheduler.py --run-today
```

### **View Weekly Overview**
```bash
python3 weekly_scheduler.py --overview
```

### **Manual Operations**
```bash
# Generate stories manually
python3 editorial_workflow.py generate-candidates

# Check approval status
python3 editorial_workflow.py status

# Process approved stories
python3 editorial_workflow.py process-approved

# Schedule content
python3 editorial_workflow.py schedule-week
```

## 🎯 **Editorial Review Process**

### **Story Evaluation Criteria**
- **Age Appropriateness**: Suitable for ages 6-12
- **Educational Value**: Teaches something valuable
- **Positive Messaging**: Inspiring and hopeful
- **Accuracy**: Factually correct information
- **Engagement**: Interesting and captivating

### **Review Portal Features**
- **Priority Scoring**: Stories ranked 1-10 by importance
- **Category Badges**: Easy identification of story types
- **Status Indicators**: Breaking, Trending, Hot topics
- **Content Preview**: Read full story before deciding
- **Editor Notes**: Add feedback and editing instructions
- **Batch Processing**: Review multiple stories efficiently

### **Approval Actions**
- **✅ Approve**: Accept story as-is
- **❌ Reject**: Decline story with reason
- **✏️ Edit & Approve**: Accept with modifications needed

## 📊 **Content Distribution Strategy**

### **Weekly Content Mix**
- **Technology**: 25% - Innovation and inventions
- **Science**: 20% - Discoveries and research
- **Environment**: 20% - Climate and conservation
- **Health**: 15% - Medical breakthroughs
- **Education**: 10% - Learning innovations
- **Sports/Culture**: 10% - Achievements and events

### **Publishing Schedule**
- **Monday**: 3-4 articles (week starter)
- **Wednesday**: 3-4 articles (mid-week boost)
- **Friday**: 3-4 articles (weekend prep)

### **Content Types**
- **Breaking News**: 10-15% of content
- **Trending Topics**: 20-25% of content
- **Hot Topics**: 15-20% of content
- **Regular Stories**: 40-55% of content

## 🔍 **Monitoring and Analytics**

### **Weekly Reports**
```bash
# View current week's status
python3 weekly_scheduler.py --overview

# Check workflow health
python3 editorial_workflow.py status
```

### **Key Metrics to Track**
- **Story Generation Rate**: 15-20 candidates per week
- **Approval Rate**: Target 50-70% approval
- **Publishing Consistency**: 3 days per week
- **Content Quality**: Editor satisfaction scores

## 🚨 **Troubleshooting**

### **Common Issues**

#### **No Stories Generated**
```bash
# Check database connection
python3 editorial_workflow.py status

# Regenerate stories
python3 editorial_workflow.py generate-candidates --count 20
```

#### **Review Portal Not Working**
```bash
# Check if port 5002 is available
lsof -i :5002

# Restart portal
python3 editorial_workflow.py review-portal
```

#### **Stories Not Publishing**
```bash
# Check scheduled content
python3 weekly_scheduler.py --overview

# Manually publish today's content
python3 weekly_scheduler.py --run-today
```

#### **Database Issues**
```bash
# Check database files exist
ls -la editorial_workflow.db junior_news.db

# Recreate workflow database
rm editorial_workflow.db
python3 editorial_workflow.py status
```

### **Log Files**
- **Workflow Logs**: Check terminal output for errors
- **Database Logs**: SQLite errors in system logs
- **Web Portal Logs**: Flask debug output

## 🔮 **Future Enhancements**

### **Planned Features**
- **AI Content Generation**: GPT integration for better stories
- **Video Generation**: Automatic video creation from articles
- **Quiz Generation**: Interactive quizzes for each story
- **Email Notifications**: Automated editor alerts
- **Mobile Review App**: Review stories on mobile
- **Analytics Dashboard**: Detailed workflow metrics
- **Content Templates**: Customizable story templates
- **Multi-Editor Support**: Team collaboration features

### **Integration Opportunities**
- **News APIs**: Real-time news data integration
- **Image Generation**: AI-powered illustrations
- **Voice Generation**: Text-to-speech for accessibility
- **Social Media**: Automated sharing capabilities
- **Parent Portal**: Family engagement features

## 📞 **Support**

### **Getting Help**
- **Documentation**: This guide and inline help
- **Command Help**: `python3 script.py --help`
- **Status Checks**: Regular monitoring commands
- **Log Analysis**: Check terminal outputs for errors

### **Best Practices**
- **Regular Monitoring**: Check status daily
- **Quality Control**: Review story quality regularly
- **Backup Strategy**: Regular database backups
- **Testing**: Test workflow changes in development
- **Documentation**: Keep notes on customizations

---

**Your Junior News Digest editorial workflow is now fully automated and ready for production!** 🎉
