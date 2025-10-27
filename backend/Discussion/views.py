from django.shortcuts import render

# Create your views here.
# api/views.py

from rest_framework import viewsets, mixins, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, ParasTransaction, Blog, Event, Resource
from .serializer import (
    UserSerializer, ParasTransactionSerializer, 
    BlogSerializer, EventSerializer, ResourceSerializer
)

# --- Permissions (Optional but Recommended) ---
class IsAdminOrReadOnly(permissions.BasePermission):
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
    # Only allow authenticated users to view/edit, admin can perform full CRUD
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly] 
    
    # Allow unauthenticated users to register (POST)
    def get_permissions(self):
        if self.action == 'create': # For user registration
            return [permissions.AllowAny()]
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
    A ViewSet for viewing and editing Blog posts.
    """
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug' # Use slug instead of ID in URLs

    def perform_create(self, serializer):
        # Automatically set the author to the currently logged-in user if the author 
        # is a ForeignKey to User (as defined in your models).
        # Requires the Author to be a User.
        if self.request.user.is_authenticated and self.request.user.role in ['ADMIN', 'TEACHER']:
             serializer.save(author=self.request.user)
        else:
             # Handle case where unprivileged user tries to create a blog
             raise permissions.PermissionDenied("You do not have permission to create blog posts.")


class EventViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing Events.
    """
    queryset = Event.objects.all().order_by('-date')
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug' # Use slug instead of ID in URLs


class ResourceViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing Resources.
    """
    queryset = Resource.objects.all().order_by('-date')
    serializer_class = ResourceSerializer
    permission_classes = [IsAdminOrReadOnly]



