# api/views.py

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, permissions
from rest_framework import filters as drf_filters 
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response

# Import the BlogFilter class and other necessary modules
from .filters import BlogFilter # <-- Import the filter from filters.py (if external)
from .models import User, ParasTransaction, Blog, Event, Resource ,Thread
from .serializer import (
    UserSerializer, ParasTransactionSerializer, 
    BlogSerializer, EventSerializer, ResourceSerializer,
    ThreadSerializer
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

from rest_framework.pagination import PageNumberPagination
class ThreadPagination(PageNumberPagination):
    page_size = 10  # Default number of threads per page
    page_size_query_param = 'page_size'  # Allow client to override, e.g. ?page_size=5
    max_page_size = 50  # Prevent abuse


# --- THREAD VIEWSET (FINAL) ---

from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Thread
from .serializer import ThreadSerializer, ThreadDetailSerializer
from .pagination import ThreadPagination


class ThreadViewSet(viewsets.ModelViewSet):
    """
    API endpoint for discussion threads and replies.
    - Shows root threads by default.
    - Supports ?parent_thread=<id> for replies.
    - Includes nested replies on detail view.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = ThreadPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "content", "user__first_name", "user__last_name"]
    ordering_fields = ["created_at", "id"]

    # --- Automatically switch serializer ---
    def get_serializer_class(self):
        # Return detailed serializer when retrieving a single thread
        if self.action == "retrieve":
            return ThreadDetailSerializer
        return ThreadSerializer

    # --- Main queryset logic ---
    def get_queryset(self):
        queryset = Thread.objects.all().order_by("-created_at")

        parent_thread_param = self.request.query_params.get("parent_thread")

        # ✅ Default: show only root threads (parent_thread IS NULL)
        if parent_thread_param is None or parent_thread_param == "null":
            queryset = queryset.filter(parent_thread__isnull=True)
        elif parent_thread_param.isdigit():
            queryset = queryset.filter(parent_thread=int(parent_thread_param))

        # ✅ Optional: category / subject filter
        category = self.request.query_params.get("category")
        if category and category.lower() != "all":
            queryset = queryset.filter(subject__iexact=category)

        return queryset

    # --- Create: auto-set user ---
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
