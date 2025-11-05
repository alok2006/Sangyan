from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.db import models

# ====================================================================
#  1. CORE CHOICES
# ====================================================================

class UserRole(models.TextChoices):
    STUDENT = 'STUDENT', 'Student'
    TEACHER = 'TEACHER', 'Teacher'
    ADMIN = 'ADMIN', 'Administrator'

class MembershipStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'

class DarkThemeColor(models.TextChoices):
    """
    A professional, dark-theme friendly palette for Thread objects.
    """
    INDIGO = '#6366F1', 'Indigo'      # Tailwind indigo-500
    EMERALD = '#10B981', 'Emerald'    # Tailwind emerald-500
    ROSE = '#F43F5E', 'Rose'          # Tailwind rose-500
    AMBER = '#F59E0B', 'Amber'        # Tailwind amber-500
    SKY = '#0EA5E9', 'Sky'            # Tailwind sky-500
    SLATE = '#64748B', 'Slate'        # Tailwind slate-500

# ====================================================================
#  2. USER & RELATED MODELS
# ====================================================================

class User(AbstractUser):
    # REMOVED: uid_string (Redundant unique ID)
    
    email = models.EmailField(unique=True, null=False, blank=False)
    photoURL = models.URLField(max_length=200, blank=True, null=True)

    role = models.CharField(
        max_length=50,
        choices=UserRole.choices,
        default=UserRole.STUDENT,
    )
    membershipStatus = models.CharField(
        max_length=50,
        choices=MembershipStatus.choices,
        default=MembershipStatus.PENDING,
        blank=True,
        null=True,
    )
    institute = models.CharField(max_length=255, blank=True, null=True)
    course = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    parasStones = models.IntegerField(default=0, verbose_name="Paras Stones Count")
    coins = models.IntegerField(default=0, verbose_name="Coins")
    
    # Consistency Fix: Define primary login field and required non-default fields.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name'] # Removed 'username'

    @property
    def displayName(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.email

class ParasTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='paras_history')
    amount = models.IntegerField()
    transaction_type = models.CharField(max_length=50) 
    timestamp = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.email} - {self.transaction_type} of {self.amount} at {self.timestamp.date()}"

# ====================================================================
#  3. THREAD MODEL
# ====================================================================


class Thread(models.Model):

    class DarkThemeColor(models.TextChoices):
        """
        A professional, dark-theme friendly palette for Thread objects.
        These values match the colors used in the Thread model.
        """
        INDIGO = '#6366F1', 'Indigo'      # Tailwind indigo-500
        EMERALD = '#10B981', 'Emerald'    # Tailwind emerald-500
        ROSE = '#F43F5E', 'Rose'          # Tailwind rose-500
        AMBER = '#F59E0B', 'Amber'        # Tailwind amber-500
        SKY = '#0EA5E9', 'Sky'            # Tailwind sky-500
        SLATE = '#64748B', 'Slate'        # Tailwind slate-500


    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='threads')
    
    # Consistency Fix: related_name is plural 'replies'
    parent_thread = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    content = models.TextField()
    color = models.TextField(choices=DarkThemeColor.choices, default=DarkThemeColor.SLATE)
    
    def __str__(self):
        return self.title

# ====================================================================
#  4. BLOG MODEL
# ====================================================================

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
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255, blank=True, null=True) 
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='blogs')
    category = models.CharField(max_length=50, choices=BlogCategory.choices, default=BlogCategory.OTHER)
    tags = models.JSONField(default=list) 
    excerpt = models.CharField(max_length=500)
    content = models.TextField()
    coverImage = models.URLField(max_length=200)
    publishedAt = models.DateTimeField(auto_now_add=True)
    readTime = models.PositiveIntegerField(verbose_name='Read Time (minutes)')
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)
    is_premuim = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-publishedAt']

    def save(self, *args, **kwargs):
        # Robust unique slug generation logic (kept for consistency)
        if not self.pk:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Blog.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

# ====================================================================
#  5. EVENT & RESOURCE MODELS
# ====================================================================

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
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=EventType.choices, default=EventType.OTHER)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, editable=False)

    date = models.DateField()
    time = models.CharField(max_length=50) # Technical Debt: Time range stored as string.
    venue = models.CharField(max_length=255)
    image = models.URLField(max_length=200)
    thumbnail = models.URLField(max_length=200, blank=True, null=True)
    mode = models.CharField(max_length=10, choices=EventMode.choices, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True, null=True)

    speaker = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    
    description = models.TextField()
    registrationLink = models.URLField(max_length=200, blank=True, null=True)
    
    maxParticipants = models.PositiveIntegerField(blank=True, null=True)
    currentParticipants = models.PositiveIntegerField(default=0)
    isPast = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Consistency Fix: Apply robust unique slug generation logic (same as Blog)
        if not self.pk:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Event.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} on {self.date}"
    
class ResourceCategory(models.TextChoices):
    VIDEO = 'video', 'Video'
    ARTICLE = 'article', 'Article'
    SLIDES = 'slides', 'Slides'
    NOTES = 'notes', 'Notes'
    PAPER = 'paper', 'Paper'

class Resource(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=ResourceCategory.choices, default=ResourceCategory.ARTICLE)
    description = models.TextField()
    link = models.URLField(max_length=200)
    date = models.DateField()
    author = models.CharField(max_length=255) 
    thumbnail = models.URLField(max_length=200, blank=True, null=True)
    downloads = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.title} ({self.category})"