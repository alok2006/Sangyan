from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# Alias the Thread model correctly to access its choices
from .models import (
    User, ParasTransaction, Blog, 
    Event, Resource, Thread as ThreadModel ,
    DarkThemeColor
)
import random

# --- CORE AUTHENTICATION SERIALIZERS ---

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    CUSTOM JWT SERIALIZER: Overrides the default to include the user's PK (as 'uid') and email
    in the response body upon successful login, aligning with UserSerializer output.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Use primary key (pk) as the canonical identifier 'uid'
        token['uid'] = str(user.pk) 
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add the 'uid' and 'email' directly to the JSON response data
        data['uid'] = str(self.user.pk)
        data['email'] = self.user.email
        return data

# Note: CustomTokenObtainPairView remains the same, using this serializer.

# --- USER AND TRANSACTION SERIALIZERS ---

class ParasTransactionSerializer(serializers.ModelSerializer):
    """ Serializer for the ParasTransaction model. """
    class Meta:
        model = ParasTransaction
        fields = ['amount', 'transaction_type', 'timestamp', 'reason']
        read_only_fields = ['timestamp']


class UserSerializer(serializers.ModelSerializer):
    """ 
    CRITICAL REFACTOR: Serializer for the custom User model (Profile/Registration). 
    Aligned with the removal of 'username' as a key identifier.
    """
    
    # Read-only fields derived from the model
    uid = serializers.CharField(source='pk', read_only=True) 
    createdAt = serializers.DateTimeField(source='date_joined', read_only=True)
    parasHistory = ParasTransactionSerializer(source='paras_history', many=True, read_only=True)
    
    # CRITICAL FIX: Use SerializerMethodField to expose the model's @property
    displayName = serializers.SerializerMethodField()
    
    # Ensure first_name/last_name are included but not required for PATCH
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'uid', 'email', 'displayName', 'photoURL', 'role', 
            'membershipStatus', 'createdAt', 'institute', 'course', 'bio', 
            'parasStones', 'coins', 'parasHistory', 'is_staff', 'is_superuser',
            'first_name', 'last_name', 'password',
        ]
        # Added 'email' to read_only_fields for standard update/patch operations
        read_only_fields = [
            'uid', 'role', 'parasStones', 'coins', 'createdAt', 
            'is_staff', 'is_superuser', 'membershipStatus', 'parasHistory', 'email'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def get_displayName(self, obj: User):
        """ Retrieves the @property displayName from the User model. """
        return obj.displayName

    def create(self, validated_data):
        """ Creates a user using email and password, consistent with USERNAME_FIELD='email'. """
        # We must explicitly handle the password and other fields
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            # Note: AbstractUser's 'username' is still required by the base model, 
            # so we use a fallback value (email) if not provided by the client.
            username=validated_data.get('username', validated_data['email']),
        )
        # Handle other custom fields
        user.institute = validated_data.get('institute')
        user.course = validated_data.get('course')
        user.bio = validated_data.get('bio')
        user.photoURL = validated_data.get('photoURL')
        user.save()
        return user
    
    def update(self, instance, validated_data):
        """ Handles updating user fields. """
        
        # Handle password update separately if it is in validated_data
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        
        # Standard update for all other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
    

# --- AUTHOR SERIALIZER (Unchanged, uses 'uid' consistently) ---

class AuthorPublicSerializer(serializers.ModelSerializer):
    """ Shallow serializer for displaying author information on content. """
    uid = serializers.CharField(source='pk', read_only=True) 
    class Meta:
        model = User
        fields = ['uid', 'displayName', 'photoURL', 'institute','bio']


# --- CONTENT SERIALIZERS ---

class BlogSerializer(serializers.ModelSerializer):
    """ Serializer for the Blog model. """
    # Keep read_only=True for author to prevent creation/update via Blog serializer
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
    # Ensure this is consistent with the User model's properties
    displayName = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['displayName', 'bio', 'institute', 'photoURL']
        
    def get_displayName(self, obj: User):
        return obj.displayName

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Using a fixed key structure for frontend consumption
        return {
            'name': representation.pop('displayName', None),
            'designation': representation.pop('bio', None), # Used bio as designation
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

    user = AuthorPublicSerializer(read_only=True, source='user') 
    reply_count = serializers.SerializerMethodField()
    
    # CRITICAL FIX: Reference the directly imported DarkThemeColor class
    color = serializers.ChoiceField(
        choices=DarkThemeColor.choices, 
        required=False
    )
    class Meta:
        model = ThreadModel
        fields = [
            'id', 'title', 'content', 'user', 'created_at', 
            'parent_thread', 'color', 'reply_count'
        ]
        read_only_fields = ['id', 'created_at', 'user', 'reply_count']
        
    def get_reply_count(self, obj):
        # CRITICAL FIX: related_name changed from 'reply' to 'replies'
        return obj.replies.count()
    
    def validate_color(self, value):
        if not value:
            # Pick a random key from the choices map
            return random.choice(ThreadModel.DarkThemeColor.choices)[0]
        return value


class ThreadDetailSerializer(ThreadSerializer):
    """ Serializer used for retrieving a single Thread, including nested replies. """
    
    reply_count = serializers.SerializerMethodField()
    # CRITICAL FIX: Use the correct, plural related_name 'replies'
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = ThreadModel
        fields = [
            'id', 'title', 'content', 'user', 'created_at', 
            'parent_thread', 'color', 'reply_count', 'replies'
        ]

    def get_replies(self, obj):
        # CRITICAL FIX: Use the correct, plural related_name 'replies'
        direct_replies = obj.replies.all()
        # Ensure nested replies use the correct ThreadSerializer alias
        return ThreadSerializer(direct_replies, many=True).data

    def get_reply_count(self, obj):
        # CRITICAL FIX: Use the correct, plural related_name 'replies'
        return obj.replies.count()