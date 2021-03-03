class OrderProductsController < ApplicationController

  def index 
    @ops = OrderProduct.all
    render json: OrderProductSerializer.new(@ops).serialize
  end

  def create
    @order_product = OrderProduct.new(order_product_params)

    if @order_product.save
      render json: OrderProductSerializer.new(@order_product), status: :created, location: @order_product
    else
      render json: @order_product.errors, status: :unprocessable_entity
    end
  end

  private
    def order_product_params
      params.require(:order_product).permit(:order_id, :product_id, :weight)
    end
end
