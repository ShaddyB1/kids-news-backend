import random
from datetime import datetime
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class KidsActivitiesGenerator:
    def __init__(self):
        self.activities = {
            'creative': [
                "🎨 Draw a picture of your favorite animal from today's news!",
                "🖍️ Color a picture of something you learned about today!",
                "📝 Write a short story about going to space!",
                "🎵 Make up a song about your favorite news story!",
                "🎭 Act out one of the news stories for your family!",
                "📚 Create your own comic book about animals!",
                "🎪 Put on a puppet show about helping the environment!",
                "🏗️ Build something cool with blocks or Legos!"
            ],
            'outdoor': [
                "🔍 Look outside and count how many different types of birds you can see!",
                "🏃‍♂️ Go outside and play for at least 30 minutes!",
                "🌱 Plant a seed and watch it grow over the next few weeks!",
                "🦋 Go on a nature hunt and find 5 different bugs or insects!",
                "🌸 Collect different colored leaves and make a pattern!",
                "⭐ Look at the stars tonight and try to find shapes!",
                "🌈 After it rains, look for rainbows in the sky!",
                "🏖️ If you're near water, collect smooth stones!"
            ],
            'educational': [
                "🧪 Try a simple science experiment with water and food coloring!",
                "📚 Read a book about something you learned today!",
                "❓ Ask an adult to help you learn more about something interesting from the news!",
                "🔢 Count how many animals you can name in 1 minute!",
                "🌍 Find your country on a map or globe!",
                "🔤 Learn a new word and use it in a sentence!",
                "🧮 Practice math by counting things around your house!",
                "📖 Look up fun facts about your favorite animal!"
            ],
            'social': [
                "👨‍👩‍👧‍👦 Share what you learned today with your family!",
                "💌 Write a thank you note to someone special!",
                "🤝 Help a family member with a chore!",
                "📞 Call a grandparent or relative and tell them about your day!",
                "🎁 Make a small gift for someone you care about!",
                "🏠 Organize your room and donate toys you don't use!",
                "👫 Play a board game with friends or family!",
                "💕 Do something kind for someone today!"
            ],
            'science': [
                "🔬 Mix baking soda and vinegar to make a volcano!",
                "🌡️ Check the temperature outside at different times!",
                "💧 See what things float and what things sink in water!",
                "🌱 Watch how plants grow toward the light!",
                "🧲 Find things around your house that are magnetic!",
                "🌙 Keep track of the moon's shape for a week!",
                "❄️ Make ice cubes in different shapes!",
                "🌪️ Make a tornado in a bottle with water and soap!"
            ]
        }
        
        self.fun_facts = [
            "🧠 Your brain uses about 20% of your body's energy!",
            "🐙 Octopuses have three hearts and blue blood!",
            "🌍 Earth is the only planet we know of that has chocolate!",
            "⭐ There are more stars in the sky than grains of sand on all beaches!",
            "🦒 Giraffes only sleep for 2 hours each day!",
            "🐧 Penguins can't fly, but they can swim super fast!",
            "🌳 Trees can live for hundreds or even thousands of years!",
            "🐝 Bees dance to tell other bees where to find flowers!",
            "🌈 Rainbows can only appear when the sun is behind you!",
            "🦋 Butterflies taste with their feet!",
            "🐠 Fish were swimming in the oceans before dinosaurs walked on land!",
            "💎 Diamonds are made from the same thing as pencil lead - carbon!"
        ]
        
        self.positive_messages = [
            "Remember: Every day is a chance to learn something new! 🌟",
            "You are amazing just the way you are! ⭐",
            "Being curious about the world makes you super smart! 🧠",
            "Small acts of kindness can make a big difference! 💕",
            "Reading helps your brain grow stronger every day! 📚",
            "Asking questions is how smart people learn! ❓",
            "Your imagination can take you anywhere! 🚀",
            "Being different makes you special! 🌈",
            "Every expert was once a beginner! 👨‍🎓",
            "You have the power to make the world better! 🌍"
        ]

    def get_daily_activities(self, count: int = 3) -> List[str]:
        """Get a random selection of activities for the day"""
        all_activities = []
        for category in self.activities.values():
            all_activities.extend(category)
        
        return random.sample(all_activities, min(count, len(all_activities)))

    def get_themed_activities(self, theme: str, count: int = 3) -> List[str]:
        """Get activities based on a theme from the news"""
        
        theme_mapping = {
            'space': ['creative', 'educational', 'science'],
            'animals': ['outdoor', 'creative', 'educational'],
            'environment': ['outdoor', 'science', 'social'],
            'science': ['science', 'educational', 'creative'],
            'technology': ['creative', 'educational', 'science'],
            'sports': ['outdoor', 'social', 'creative'],
            'art': ['creative', 'social', 'educational']
        }
        
        categories = theme_mapping.get(theme.lower(), ['creative', 'educational'])
        
        selected_activities = []
        for category in categories:
            if category in self.activities:
                activity = random.choice(self.activities[category])
                selected_activities.append(activity)
        
        # Fill remaining spots with random activities
        while len(selected_activities) < count:
            all_activities = []
            for category in self.activities.values():
                all_activities.extend(category)
            activity = random.choice(all_activities)
            if activity not in selected_activities:
                selected_activities.append(activity)
        
        return selected_activities[:count]

    def get_fun_fact(self) -> str:
        """Get a random fun fact for kids"""
        return random.choice(self.fun_facts)

    def get_positive_message(self) -> str:
        """Get a positive/encouraging message for kids"""
        return random.choice(self.positive_messages)

    def get_weather_activity(self, weather: str) -> str:
        """Get activity suggestion based on weather"""
        
        weather_activities = {
            'sunny': [
                "🌞 Go outside and make shadow shapes with your hands!",
                "🌻 Look for flowers and count how many colors you see!",
                "🏃‍♂️ Have a race in your backyard!",
                "🎨 Draw with chalk on the sidewalk!"
            ],
            'rainy': [
                "🌧️ Watch the raindrops race down the window!",
                "📚 Read a cozy book inside!",
                "🧩 Work on a puzzle!",
                "🎵 Dance to your favorite songs!"
            ],
            'cloudy': [
                "☁️ Look at the clouds and see what shapes you can find!",
                "🚶‍♂️ Take a nature walk and look for interesting things!",
                "📸 Take pictures of cool things you see outside!",
                "🎪 Have a picnic in your living room!"
            ],
            'snowy': [
                "❄️ Catch snowflakes on your tongue!",
                "⛄ Build a snowman or snow fort!",
                "🔥 Drink hot chocolate and count the marshmallows!",
                "❄️ Look at snowflakes with a magnifying glass!"
            ]
        }
        
        activities = weather_activities.get(weather.lower(), weather_activities['sunny'])
        return random.choice(activities)

    def create_kids_section_html(self, theme: str = None) -> str:
        """Create HTML section for kids activities"""
        
        if theme:
            activities = self.get_themed_activities(theme, 3)
        else:
            activities = self.get_daily_activities(3)
        
        fun_fact = self.get_fun_fact()
        positive_message = self.get_positive_message()
        
        html = f"""
        <div class="fun-fact">
            <h3 style="margin-top: 0;">🎯 Fun Activities for Today!</h3>
            <ul style="text-align: left; margin: 10px 0;">
        """
        
        for activity in activities:
            html += f"<li style='margin: 8px 0; font-size: 1.1em;'>{activity}</li>"
        
        html += f"""
            </ul>
        </div>
        
        <div class="fun-fact" style="background: linear-gradient(45deg, #74b9ff, #0984e3);">
            <h3 style="margin-top: 0;">🤓 Cool Fact of the Day!</h3>
            <p style="margin: 10px 0; font-size: 1.1em;">{fun_fact}</p>
        </div>
        
        <div class="fun-fact" style="background: linear-gradient(45deg, #00b894, #00cec9);">
            <h3 style="margin-top: 0;">💝 Message for You!</h3>
            <p style="margin: 10px 0; font-size: 1.1em;">{positive_message}</p>
        </div>
        """
        
        return html

    def create_kids_section_text(self, theme: str = None) -> str:
        """Create text section for kids activities"""
        
        if theme:
            activities = self.get_themed_activities(theme, 3)
        else:
            activities = self.get_daily_activities(3)
        
        fun_fact = self.get_fun_fact()
        positive_message = self.get_positive_message()
        
        text = "\n🎯 FUN ACTIVITIES FOR TODAY!\n"
        text += "-" * 30 + "\n"
        
        for i, activity in enumerate(activities, 1):
            text += f"{i}. {activity}\n"
        
        text += f"\n🤓 COOL FACT OF THE DAY!\n"
        text += "-" * 25 + "\n"
        text += f"{fun_fact}\n"
        
        text += f"\n💝 MESSAGE FOR YOU!\n"
        text += "-" * 18 + "\n"
        text += f"{positive_message}\n"
        
        return text

# Example usage
if __name__ == "__main__":
    generator = KidsActivitiesGenerator()
    
    print("=== Daily Activities ===")
    activities = generator.get_daily_activities(5)
    for activity in activities:
        print(f"  {activity}")
    
    print(f"\n=== Fun Fact ===")
    print(f"  {generator.get_fun_fact()}")
    
    print(f"\n=== Positive Message ===")
    print(f"  {generator.get_positive_message()}")
    
    print(f"\n=== Space-themed Activities ===")
    space_activities = generator.get_themed_activities('space', 3)
    for activity in space_activities:
        print(f"  {activity}")
    
    print(f"\n=== Weather Activity (sunny) ===")
    print(f"  {generator.get_weather_activity('sunny')}")
    
    print(f"\n=== HTML Section ===")
    html_section = generator.create_kids_section_html('animals')
    print(html_section[:200] + "...") 