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

  
  private
  def route_params 
    params.require(:route).permit(:id)
  end

end