# api/views.py

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, permissions
from rest_framework import filters as drf_filters # <-- Import DRF filters with alias!
from rest_framework.decorators import action
from rest_framework.response import Response

# Import the BlogFilter class and other necessary modules
from .filters import BlogFilter # <-- Import the filter from filters.py (if external)
from .models import User, ParasTransaction, Blog, Event, Resource 
from .serializer import (
    UserSerializer, ParasTransactionSerializer, 
    BlogSerializer, EventSerializer, ResourceSerializer
)

# --- Permissions (Optional but Recommended) ---
class IsAdminOrReadOnly(permissions.BasePermission): # <-- Defined locally
    """
    Custom permission to only allow administrators to create/update/delete 
    objects, but allow read access to all.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to admin users
        return request.user and request.user.is_staff

# --- USER AND AUTH VIEWS ---
# ---------------------------

class UserViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing User instances.
    Provides CRUD operations for User.
    """
    queryset = User.objects.all().order_by('email')
    serializer_class = UserSerializer
    # FIX APPLIED: IsAdminOrReadOnly is correctly referenced by its local name.
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly] 
    
    # Allow unauthenticated users to register (POST)
    def get_permissions(self):
        if self.action == 'create': # For user registration
            return [permissions.AllowAny()]
        # IMPORTANT: When the custom permission class is defined outside of the
        # rest_framework.permissions module, it must be referenced directly by name.
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Custom endpoint to get the current logged-in user's details.
        URL: /users/me/
        """
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return Response({"detail": "Authentication credentials were not provided."}, status=401)
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Custom endpoint to get a user's ParasTransaction history.
        URL: /users/{pk}/history/
        """
        user = self.get_object()
        history = user.paras_history.all().order_by('-timestamp')
        serializer = ParasTransactionSerializer(history, many=True)
        return Response(serializer.data)


# Note: ParasTransaction is often handled via nested routing or as a separate admin view.
# Here's a simple Read-Only ViewSet for listing all transactions (Admin only).
class ParasTransactionViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    A ViewSet for viewing ParasTransaction instances. (Admin/Read-Only)
    """
    queryset = ParasTransaction.objects.all().order_by('-timestamp')
    serializer_class = ParasTransactionSerializer
    permission_classes = [permissions.IsAdminUser]


# --- CONTENT VIEWS ---
# ---------------------

class BlogViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing Blog posts, enabled with filtering and ordering.
    """
    queryset = Blog.objects.all().order_by('-publishedAt') 
    serializer_class = BlogSerializer
    # FIX APPLIED: Referenced directly by name
    permission_classes = [IsAdminOrReadOnly] 
    lookup_field = 'slug' 

    # --- Filtering and Ordering Setup ---
    filter_backends = [
        DjangoFilterBackend,              # Filters based on filterset_class (django-filter)
        drf_filters.OrderingFilter,       # Allows ?ordering=views,-publishedAt
        drf_filters.SearchFilter          # Allows ?search=keyword (based on search_fields)
    ]
    
    # Assuming BlogFilter is imported successfully from .filters
    # If BlogFilter is defined later in this file, the class definition should move up.
    filterset_class = BlogFilter          
    ordering_fields = ['publishedAt', 'views', 'readTime', 'likes']
    search_fields = ['title', 'excerpt', 'content'] # Fields used by SearchFilter
    # ------------------------------------

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and self.request.user.role in ['ADMIN', 'TEACHER']:
             serializer.save(author=self.request.user)
        else:
             raise permissions.PermissionDenied("You do not have permission to create blog posts.")

class EventViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing Events.
    """
    queryset = Event.objects.all().order_by('-date')
    serializer_class = EventSerializer
    # FIX APPLIED: Referenced directly by name
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug' 


class ResourceViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing Resources.
    """
    queryset = Resource.objects.all().order_by('-date')
    serializer_class = ResourceSerializer
    # FIX APPLIED: Referenced directly by name
    permission_classes = [IsAdminOrReadOnly]