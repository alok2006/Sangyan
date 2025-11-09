from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import random

# --- MODELS ---
from .models import (
    User, ParasTransaction, Blog, Event, Resource,
    Thread as ThreadModel, DarkThemeColor
)

# =============================================================================
# AUTH & USER SERIALIZERS
# =============================================================================

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """ Custom JWT Token serializer adding uid and email in token. """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['uid'] = str(user.pk)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'uid': str(self.user.pk),
            'email': self.user.email,
        })
        return data


class ParasTransactionSerializer(serializers.ModelSerializer):
    """ Serializer for ParasTransaction model. """
    class Meta:
        model = ParasTransaction
        fields = ['amount', 'transaction_type', 'timestamp', 'reason']
        read_only_fields = ['timestamp']


class UserSerializer(serializers.ModelSerializer):
    """ Serializer for full User model (used for admin or self-profile). """
    uid = serializers.CharField(source='pk', read_only=True)
    createdAt = serializers.DateTimeField(source='date_joined', read_only=True)
    parasHistory = ParasTransactionSerializer(source='paras_history', many=True, read_only=True)
    displayName = serializers.SerializerMethodField()

    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'uid', 'email', 'displayName', 'photoURL', 'role',
            'membershipStatus', 'createdAt', 'institute', 'course', 'bio',
            'parasStones', 'coins', 'parasHistory', 'is_staff', 'is_superuser',
            'first_name', 'last_name', 'password', 'username',
        ]
        read_only_fields = [
            'uid', 'role', 'parasStones', 'coins', 'createdAt',
            'is_staff', 'is_superuser', 'membershipStatus', 'parasHistory',
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def get_displayName(self, obj):
        return obj.displayName

    def create(self, validated_data):
        """ Create user and hash password properly. """
        password = validated_data.pop('password', None)
        user = User.objects.create_user(password=password, **validated_data)
        return user

    def update(self, instance, validated_data):
        """ Support password change in update. """
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class AuthorPublicSerializer(serializers.ModelSerializer):
    """ Lightweight serializer for showing author info publicly. """
    uid = serializers.CharField(source='pk', read_only=True)

    class Meta:
        model = User
        fields = ['uid', 'displayName', 'photoURL', 'institute', 'bio']


# =============================================================================
# BLOG / EVENT / RESOURCE SERIALIZERS
# =============================================================================

class BlogSerializer(serializers.ModelSerializer):
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
    displayName = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['displayName', 'bio', 'institute', 'photoURL']

    def get_displayName(self, obj):
        return obj.displayName

    def to_representation(self, instance):
        """ Transform fields for frontend compatibility. """
        rep = super().to_representation(instance)
        return {
            'name': rep.pop('displayName', None),
            'designation': rep.pop('bio', None),
            'institute': rep.pop('institute', None),
            'avatar': rep.pop('photoURL', None),
        }


class EventSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'category', 'description', 'link', 'date',
            'author', 'thumbnail', 'downloads'
        ]
        read_only_fields = ['id', 'downloads']


# =============================================================================
# THREAD / FORUM SERIALIZERS
# =============================================================================

class ThreadSerializer(serializers.ModelSerializer):
    """
    Serializer for the Thread model (Forum posts and replies).
    Includes reply count and optionally nested replies (in detail view).
    """
    user = AuthorPublicSerializer(read_only=True)
    reply_count = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    subject = serializers.CharField(required=False)
    color = serializers.ChoiceField(choices=DarkThemeColor.choices, required=False)

    class Meta:
        model = ThreadModel
        fields = [
            'id', 'title', 'content', 'user', 'created_at',
            'parent_thread', 'color', 'reply_count', 'replies', 'subject'
        ]
        read_only_fields = ['id', 'created_at', 'reply_count', 'user']

    # --- Helpers ---
    def get_reply_count(self, obj):
        return obj.replies.count()

    def get_replies(self, obj):
        """ Return replies only in detail (retrieve) views. """
        request = self.context.get('request')
        if not request:
            return []
        view = getattr(request.parser_context.get('view', None), 'action', None)
        if view == 'retrieve':
            replies = obj.replies.all().order_by('created_at')
            return ThreadSerializer(replies, many=True, context=self.context).data
        return []

    # --- Validation ---
    def validate_color(self, value):
        return value or random.choice(DarkThemeColor.choices)[0]

    def validate_subject(self, value):
        if value and value not in ThreadModel.Subject.values:
            raise serializers.ValidationError(f"'{value}' is not a valid subject.")
        return value

    # --- Create ---
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        validated_data.setdefault('color', random.choice(DarkThemeColor.choices)[0])
        return super().create(validated_data)


class ThreadDetailSerializer(ThreadSerializer):
    """
    Serializer for single Thread detail view.
    Always includes direct replies (no conditional filtering).
    """
    class Meta(ThreadSerializer.Meta):
        fields = ThreadSerializer.Meta.fields

    def get_replies(self, obj):
        replies = obj.replies.all().order_by('created_at')
        return ThreadSerializer(replies, many=True, context=self.context).data


# =============================================================================
# PAGINATION WRAPPER
# =============================================================================

class PaginatedThreadSerializer(serializers.Serializer):
    """ Wrapper for paginated thread response metadata. """
    count = serializers.IntegerField(source='paginator.count')
    total_pages = serializers.IntegerField(source='paginator.num_pages')
    next = serializers.URLField(source='get_next_link', allow_null=True)
    previous = serializers.URLField(source='get_previous_link', allow_null=True)
    results = ThreadSerializer(source='object_list', many=True)
