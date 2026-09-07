from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    """Allow bounded page sizes for data-heavy workspace views."""

    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 2000
