from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.db import models

class UserRole(models.TextChoices):
    STUDENT = 'STUDENT', 'Student'
    TEACHER = 'TEACHER', 'Teacher'
    ADMIN = 'ADMIN', 'Administrator'

class MembershipStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'

class ParasTransaction(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='paras_history')
    amount = models.IntegerField()
    transaction_type = models.CharField(max_length=50) # e.g., 'earning', 'spending'
    timestamp = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.email} - {self.transaction_type} of {self.amount} at {self.timestamp.date()}"

class User(AbstractUser):
    # id = models.CharField(max_length=255, unique=True, blank=True,primary_key=True)
    # 
    uid_string = models.CharField(max_length=255, unique=True, blank=True, null=True) 
    email = models.EmailField(unique=True, null=False, blank=False)
    # 'displayName' maps to 'first_name'/'last_name' in AbstractUser; or a new field:
    displayName = models.CharField(max_length=255, blank=True, null=True)
    photoURL = models.URLField(max_length=200, blank=True, null=True)

    role = models.CharField(
        max_length=50,
        choices=UserRole.choices,
        default=UserRole.STUDENT, # Default Value
    )
    
    # Membership Status Field
    membershipStatus = models.CharField(
        max_length=50,
        choices=MembershipStatus.choices,
        default=MembershipStatus.PENDING, # Default Value
        blank=True,
        null=True,
    )
    institute = models.CharField(max_length=255, blank=True, null=True)
    course = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    parasStones = models.IntegerField(
        default=0, # Default Value
        verbose_name="Paras Stones Count"
    )
    coins = models.IntegerField(
        default=0, # Default Value
        verbose_name="Coins"
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name'] # Keep default fields required

    def __str__(self):
        return self.email

# Note on 'parasHistory': The `ParasTransaction` model with a ForeignKey to `CustomUser` 
# achieves the same goal as an array of transactions in TypeScript.


class BlogCategory(models.TextChoices):
    PHYSICS = 'Physics', 'Physics'
    CHEMISTRY = 'Chemistry', 'Chemistry'
    BIOLOGY = 'Biology', 'Biology'
    MATHS = 'Mathematics', 'Mathematics'
    EARTH = 'Earth Sciences', 'Earth Sciences'
    CS = 'Computer Science', 'Computer Science'
    INTERDISC = 'Interdisciplinary', 'Interdisciplinary'
    DATASCI = 'Data Science', 'Data Science'
    OTHER = 'Other', 'Other'

class Blog(models.Model):
    # id (Primary Key) is automatic in Django
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255, editable=False) # Auto-generated on save
    
    # Foreign Key to Author model
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='blogs')
    
    category = models.CharField(
        max_length=50, 
        choices=BlogCategory.choices, 
        default=BlogCategory.OTHER
    )
    tags = models.JSONField(default=list) 
    
    excerpt = models.CharField(max_length=500)
    content = models.TextField()
    coverImage = models.URLField(max_length=200)
    publishedAt = models.DateTimeField(auto_now_add=True)
    
    readTime = models.PositiveIntegerField(verbose_name='Read Time (minutes)')
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-publishedAt']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    

# content/models.py (continued)

class EventType(models.TextChoices):
    TALK = 'talk', 'Talk'
    WORKSHOP = 'workshop', 'Workshop'
    PROJECT = 'project', 'Project'
    DISCUSSION = 'discussion', 'Discussion'
    SEMINAR = 'seminar', 'Seminar'
    OTHER = 'other', 'Other'

class EventMode(models.TextChoices):
    ONLINE = 'online', 'Online'
    OFFLINE = 'offline', 'Offline'
    HYBRID = 'hybrid', 'Hybrid'

class Event(models.Model):
    """
    Model corresponding to the Event interface.
    """
    title = models.CharField(max_length=255)
    type = models.CharField(
        max_length=50, 
        choices=EventType.choices, 
        default=EventType.OTHER
    )
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, editable=False)

    date = models.DateField()
    time = models.CharField(max_length=50) # Storing time as a string for flexibility (e.g., '10:00 AM - 12:00 PM')
    venue = models.CharField(max_length=255)
    image = models.URLField(max_length=200)
    thumbnail = models.URLField(max_length=200, blank=True, null=True)
    
    mode = models.CharField(
        max_length=10, 
        choices=EventMode.choices, 
        blank=True, 
        null=True
    )
    tags = models.JSONField(default=list, blank=True, null=True)

    # Foreign Key for the speaker object
    speaker = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    
    description = models.TextField()
    registrationLink = models.URLField(max_length=200, blank=True, null=True)
    
    maxParticipants = models.PositiveIntegerField(blank=True, null=True)
    currentParticipants = models.PositiveIntegerField(default=0)
    isPast = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Auto-generate slug from title if not provided
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} on {self.date}"
    
# content/models.py (continued)

class ResourceCategory(models.TextChoices):
    VIDEO = 'video', 'Video'
    ARTICLE = 'article', 'Article'
    SLIDES = 'slides', 'Slides'
    NOTES = 'notes', 'Notes'
    PAPER = 'paper', 'Paper'

class Resource(models.Model):
    """
    Model corresponding to the Resource interface.
    """
    title = models.CharField(max_length=255)
    category = models.CharField(
        max_length=50, 
        choices=ResourceCategory.choices, 
        default=ResourceCategory.ARTICLE
    )
    description = models.TextField()
    link = models.URLField(max_length=200)
    date = models.DateField()
    author = models.CharField(max_length=255) # Storing author as a simple string
    thumbnail = models.URLField(max_length=200, blank=True, null=True)
    downloads = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.title} ({self.category})"