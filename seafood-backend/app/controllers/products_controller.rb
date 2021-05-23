class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :update, :destroy]

  # GET /products
  def index
    @products = Product.all

    render json: ProductSerializer.new(@products).serialize
  end

  # GET /products/1
  def show
    render json: ProductSerializer.new(@product).serialize
  end

  # POST /products
  def create
    @product = Product.new(product_params)

    if @product.save
      render json: ProductSerializer.new(@product).serialize, status: :created, location: @product
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /products/1
  def update
    if @product.update(product_params)
      render json: ProductSerializer.new(@product).serialize
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  # DELETE /products/1
  def destroy
    @product.destroy
    render json: ProductSerializer.new(@product).serialize
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def product_params
      params.require(:product).permit(:description, :price, :item_number, :avail_weight, :active, :id)
    end
end
