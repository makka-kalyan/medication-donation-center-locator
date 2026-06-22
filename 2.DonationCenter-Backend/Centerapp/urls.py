from django.urls import path
from .views import register_api, login_api, user_details_api
from .views import (
    approve_user_api,
    admin_page_api,
    user_page_api,
    add_donation_center_api,
    admin_centers_api,
    update_center_timing_api,
    toggle_center_status_api,
    admin_categories_api,
    delete_category_api,
    centers_by_type_api,
    
)

urlpatterns = [
 
    path("register/", register_api),
    path("login/", login_api),
    path("user/", user_page_api),
    path("admin/", admin_page_api),
    path("approve/", approve_user_api),
    path("userdetails/", user_details_api),
    path("admin/add-center/",add_donation_center_api),
    path("admin/centers/",admin_centers_api),
    path("admin/update-timing/",update_center_timing_api),
    path("admin/toggle-center/",toggle_center_status_api),
    path("admin/categories/",admin_categories_api),
    path("admin/delete-category/",delete_category_api),

    path("centers_type",centers_by_type_api),


]
