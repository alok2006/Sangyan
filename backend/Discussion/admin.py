from django.contrib import admin
from . import models as m
from .models import User, ParasTransaction 

admin.site.register(User)

# --- Registering the Transaction Model ---

@admin.register(ParasTransaction)
class ParasTransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'transaction_type', 'timestamp')
    list_filter = ('transaction_type', 'timestamp')
    search_fields = ('user__email', 'reason')
    readonly_fields = ('timestamp',)
    date_hierarchy = 'timestamp' 


admin.site.register(m.Blog)
admin.site.register(m.Event)
admin.site.register(m.Resource)