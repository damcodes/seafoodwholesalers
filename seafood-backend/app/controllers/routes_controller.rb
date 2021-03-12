class RoutesController < ApplicationController 
  skip_before_action :authorized, only: [:index]

  def index 
    @routes = Route.all 

    render json: RouteSerializer.new(@routes).serialize
  end

  def show
    @route = Route.find_by(id: params[:id])

    render json: RouteSerializer.new(@route).serialize
  end

  def update
    @route = Route.find_by(id: params[:id])
    if @route.status != 'delivered'
      if @route.update(route_params)
        render json: RouteSerializer.new(@route).serialize
      else
        render json: @route.errors
      end
    else
      render json: { message: 'Cannot patch, route already delivered'}
    end
  end
  
  private
  def route_params 
    params.require(:route).permit(:id, :status)
  end

end