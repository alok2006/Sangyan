from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class ThreadPagination(PageNumberPagination):
    """
    Custom pagination class to structure the output for the frontend.
    """
    page_size = 8  # Set your desired page size here
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages, # CRITICAL: Add total_pages
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'threads': data  # Rename 'results' to 'threads'
        })