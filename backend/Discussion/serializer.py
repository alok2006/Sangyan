# serializers.py

from rest_framework import serializers
from .models import (
    User, ParasTransaction, Blog, BlogCategory, 
    Event, EventType, EventMode, Resource, ResourceCategory
)

# --- USER AND TRANSACTION SERIALIZERS ---
# ----------------------------------------

class ParasTransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for the ParasTransaction model.
    """
    # Note: 'user' field is typically not included in the transaction serializer 
    # when listing a user's transactions (it's implicit), but included for creation.
    # We omit it here for a cleaner nested representation.

    class Meta:
        model = ParasTransaction
        fields = [
            'amount', 
            'transaction_type', 
            'timestamp', 
            'reason'
        ]
        read_only_fields = ['timestamp']


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom User model.
    Maps to the UserData interface.
    """
    # Custom fields mirroring the interface:
    # 1. parasHistory: Use the nested serializer for the related model
    #    The 'related_name' on the ForeignKey is 'paras_history'
    parasHistory = ParasTransactionSerializer(
        source='paras_history',  # Use the related_name from the ForeignKey
        many=True, 
        read_only=True
    )
    
    # 2. displayName: Read/Write field
    # 3. photoURL: Read/Write field
    
    # Optional field: createdAt is represented by date_joined in AbstractUser
    createdAt = serializers.DateTimeField(source='date_joined', read_only=True)
    
    # We must explicitly handle the 'uid' field if it is the primary key.
    # For user creation, typically only email, username, and password are sent.

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'displayName', 'photoURL', 'role', 
            'membershipStatus', 'createdAt', 'institute', 'course', 'bio', 
            'parasStones', 'coins', 'parasHistory', 'is_staff', 'is_superuser','password'
        ]
        read_only_fields = [
            'uid', 'role', 'parasStones', 'coins', 'createdAt', 'is_staff', 'is_superuser', 
            'membershipStatus', 'parasHistory'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'username': {'required': True},
            'email': {'required': True},
        }

    # Optional: Customize the creation process to handle password hashing
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            # ... include other fields if necessary
        )
        return user


# --- CONTENT SERIALIZERS ---
# ---------------------------

class BlogSerializer(serializers.ModelSerializer):
    """
    Serializer for the Blog model.
    """
    # The 'author' is a Foreign Key to the User model. 
    # We display a simplified representation of the author.
    # NOTE: If you want *full* author details, use a nested UserSerializer (or a subset).
    class AuthorPublicSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ['uid', 'displayName', 'photoURL', 'institute']

    author = AuthorPublicSerializer(read_only=True)
    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'author', 'category', 'tags', 'excerpt', 
            'content', 'coverImage', 'publishedAt', 'readTime', 'views', 
            'likes', 'featured'
        ]
        read_only_fields = ['id', 'slug', 'publishedAt', 'views', 'likes']


class EventSpeakerSerializer(serializers.ModelSerializer):
    """
    A simplified serializer for the speaker object within the Event.
    """
    class Meta:
        model = User
        fields = [
            'displayName', 'institute', 'photoURL' # Mapping User fields to speaker object
        ]
        # Rename fields for the output to match the Event interface speaker object keys
        # This requires custom methods or explicit fields, but for simplicity, we use:
        # NOTE: User model fields 'displayName', 'institute', 'photoURL' will output as is.
        # To strictly match the interface's speaker structure, use:
        # fields = ['name', 'designation', 'institute', 'avatar']
        # source='first_name' for 'name', etc., but since we FK to User, we use User fields.
        
        # If the User model does not have 'designation', 'name' (for User, use 'displayName'),
        # or 'avatar' (for User, use 'photoURL'), this will need adjustment.
        # Assuming: name=displayName, avatar=photoURL, designation/institute are available.
        
        # We will map: name -> displayName, avatar -> photoURL, designation -> bio (as a proxy)
        fields = ['displayName', 'bio', 'institute', 'photoURL']
        
        extra_kwargs = {
            'displayName': {'source': 'displayName'}, # name
            'bio': {'source': 'bio'},                 # designation (as a proxy)
            'photoURL': {'source': 'photoURL'},       # avatar
        }
        
    def to_representation(self, instance):
        """Customizes the output to match the 'speaker' object structure."""
        representation = super().to_representation(instance)
        return {
            'name': representation.pop('displayName', None),
            'designation': representation.pop('bio', None),
            'institute': representation.pop('institute', None),
            'avatar': representation.pop('photoURL', None),
        }


class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model.
    """
    # Nested serializer for the 'speaker' object
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
    """
    Serializer for the Resource model.
    """
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'category', 'description', 'link', 'date', 
            'author', 'thumbnail', 'downloads'
        ]
        read_only_fields = ['id', 'downloads']