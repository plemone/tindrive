from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', include('FS.urls')), # you don't need to include "/" as implicitly default hompage contains "/"
]
