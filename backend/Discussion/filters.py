from django_filters.rest_framework import FilterSet
from .models import Blog # Ensure this import path is correct
import django_filters

class BlogFilter(FilterSet):
    # Optional: Enable full-text search on title (uses lookup_expr for flexibility)
    title = django_filters.CharFilter(lookup_expr='icontains')
    
    # Optional: Filter by range of read time
    min_read_time = django_filters.NumberFilter(field_name="readTime", lookup_expr='gte')
    max_read_time = django_filters.NumberFilter(field_name="readTime", lookup_expr='lte')

    class Meta:
        model = Blog
        # These fields support direct filtering (e.g., ?category=Physics&featured=True)
        fields = [
            'category', 
            'featured', 
            'is_premuim',
            'title',
        ]