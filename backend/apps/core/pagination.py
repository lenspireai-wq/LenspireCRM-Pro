from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    """Allow workspace screens to request a larger, bounded result set."""

    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 5000
