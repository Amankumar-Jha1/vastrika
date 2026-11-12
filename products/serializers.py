from rest_framework import serializers
from .models import Category, Product, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'image', 'is_active', 'category', 'category_name', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity']

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'full_name', 'email', 'address', 'city', 'postal_code', 'total_amount', 'items', 'status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
            # Deduct stock when an order is placed
            product = item_data['product']
            if product.stock >= item_data['quantity']:
                product.stock -= item_data['quantity']
                product.save()
                
        return order