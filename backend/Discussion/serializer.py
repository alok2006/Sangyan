from rest_framework import serializers
from .models import (
    User, ParasTransaction, Blog, BlogCategory, 
    Event, EventType, EventMode, Resource, ResourceCategory, 
    Thread, UserRole, MembershipStatus, Thread as ThreadModel # Use ThreadModel to avoid name conflict in models import
)
import random

# --- USER AND TRANSACTION SERIALIZERS ---

class ParasTransactionSerializer(serializers.ModelSerializer):
    """ Serializer for the ParasTransaction model. """
    class Meta:
        model = ParasTransaction
        fields = ['amount', 'transaction_type', 'timestamp', 'reason']
        read_only_fields = ['timestamp']


class UserSerializer(serializers.ModelSerializer):
    """ Serializer for the custom User model (Profile/Registration). """
    
    # 1. parasHistory: Nested serializer for transactions
    parasHistory = ParasTransactionSerializer(source='paras_history', many=True, read_only=True)
    
    # 2. uid (pk) mapping: Use the inherited integer primary key (pk) as 'uid'
    uid = serializers.IntegerField(source='pk', read_only=True)
    
    # 3. createdAt is mapped from date_joined
    createdAt = serializers.DateTimeField(source='date_joined', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'uid', 'uid_string', 'email', 'username', 'displayName', 'photoURL', 'role', 
            'membershipStatus', 'createdAt', 'institute', 'course', 'bio', 
            'parasStones', 'coins', 'parasHistory', 'is_staff', 'is_superuser','password'
        ]
        read_only_fields = [
            'uid', 'uid_string', 'role', 'parasStones', 'coins', 'createdAt', 
            'is_staff', 'is_superuser', 'membershipStatus', 'parasHistory'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'username': {'required': True},
            'email': {'required': True},
        }

    def create(self, validated_data):
        # Handles user creation with password hashing and custom field population
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            institute=validated_data.get('institute'),
            course=validated_data.get('course'),
            displayName=validated_data.get('displayName'),
        )
        return user


# --- CONTENT SERIALIZERS ---

class AuthorPublicSerializer(serializers.ModelSerializer):
    """ Shallow serializer for displaying author information on content. """
    class Meta:
        model = User
        fields = ['pk', 'displayName', 'photoURL', 'institute','bio']


class BlogSerializer(serializers.ModelSerializer):
    """ Serializer for the Blog model. """
    
    author = AuthorPublicSerializer(read_only=True)
    
    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'author', 'category', 'tags', 'excerpt', 
            'content', 'coverImage', 'publishedAt', 'readTime', 'views', 
            'likes', 'featured', 'is_premuim'
        ]
        read_only_fields = ['id', 'slug', 'publishedAt', 'views', 'likes']


class EventSpeakerSerializer(serializers.ModelSerializer):
    """ Simplified serializer for the speaker object within the Event. """
    
    class Meta:
        model = User
        fields = ['displayName', 'bio', 'institute', 'photoURL']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {
            'name': representation.pop('displayName', None),
            'designation': representation.pop('bio', None), # Using bio as proxy for designation
            'institute': representation.pop('institute', None),
            'avatar': representation.pop('photoURL', None),
        }


class EventSerializer(serializers.ModelSerializer):
    """ Serializer for the Event model. """
    
    speaker = EventSpeakerSerializer(read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'type', 'slug', 'date', 'time', 'venue', 'image', 
            'mode', 'tags', 'speaker', 'description', 'registrationLink', 
            'maxParticipants', 'currentParticipants', 'isPast', 'thumbnail'
        ]
        read_only_fields = ['id', 'slug', 'currentParticipants', 'isPast']


class ResourceSerializer(serializers.ModelSerializer):
    """ Serializer for the Resource model. """
    
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'category', 'description', 'link', 'date', 
            'author', 'thumbnail', 'downloads'
        ]
        read_only_fields = ['id', 'downloads']


# --- THREAD/FORUM SERIALIZERS ---

class ThreadSerializer(serializers.ModelSerializer):
    """ Serializer for the Thread model (Forum posts and replies). """

    user = AuthorPublicSerializer(read_only=True)
    reply_count = serializers.SerializerMethodField()
    
    # Overriding color to ensure a default is chosen if not provided by the client
    color = serializers.ChoiceField(
        choices=Thread.RandomColor.choices, 
        required=False
    )
    
    class Meta:
        model = Thread
        fields = [
            'id', 'title', 'content', 'user', 'created_at', 
            'parent_thread', 'color', 'reply_count'
        ]
        read_only_fields = ['id', 'created_at', 'user', 'reply_count']
        
    def get_reply_count(self, obj):
        return obj.reply.count()
    
    def validate_color(self, value):
        # If no color is provided by the user, randomly select one from the choices
        if not value:
            return random.choice(Thread.RandomColor.choices)[0]
        return value


class ThreadDetailSerializer(ThreadSerializer):
    """ Serializer used for retrieving a single Thread, including nested replies. """
    
    reply_count = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Thread
        fields = [
            'id', 'title', 'content', 'user', 'created_at', 
            'parent_thread', 'color', 'reply_count', 'replies'
        ]

    def get_replies(self, obj):
        # Uses the shallow ThreadSerializer for the nested replies (limits depth)
        direct_replies = obj.reply.all()
        return ThreadSerializer(direct_replies, many=True).data

    def get_reply_count(self, obj):
        return obj.reply.count()