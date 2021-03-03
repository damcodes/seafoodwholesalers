class OrdersController < ApplicationController
  before_action :set_order, only: [:show, :update, :destroy]

  # GET /orders
  def index
    @orders = Order.all

    render json: OrderSerializer.new(@orders).serialize
  end

  # GET /orders/1
  def show
    render json: OrderSerializer.new(@order).serialize
  end

  # POST /orders
  def create
    user = current_user
    user_company = user.company
    route_id = user_company.route_id
    # byebug
    if Order.all.length == 0 
      if user_company.name == 'Seafood Wholesalers'
        @order = Order.new(user_id: order_params[:user_id], order_number: 101010, order_total: order_params[:order_total], route_id: route_id)
      else 
        @order = Order.new(user_id: order_params[:user_id], order_number: 646000, order_total: order_params[:order_total], route_id: route_id)
      end
    else
      # byebug
      if user_company.name == 'Seafood Wholesalers' 
        last_order = Order.all.select{ |order| order.order_number < 645999 }.last
      else 
        last_order = Order.all.select{ |order| order.order_number > 645999 }.last
      end
      new_order_num = last_order.order_number + 1
      @order = Order.new(user_id: order_params[:user_id], order_number: new_order_num, order_total: order_params[:order_total], route_id: route_id)
    end
    # byebug
    if @order.save
      render json: OrderSerializer.new(@order).serialize, status: :created, location: @order
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /orders/1
  def update
    if @order.update(order_params)
      render json: OrderSerializer.new(@order).serialize
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  # DELETE /orders/1
  def destroy
    @order.destroy
  end

  # def get_order
  #   order = Order.find_by(order_number: order_params[:order_number])
  #   render json: OrderSerializer.new(order).serialize
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_order
      @order = Order.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def order_params
      params.require(:order).permit(:user_id, :order_status, :order_total, :route_id)
    end
end
