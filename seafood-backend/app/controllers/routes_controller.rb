class RoutesController < ApplicationController 
  skip_before_action :authorized, only: [:index]

  def index 
    @routes = Route.all 

    render json: RouteSerializer.new(@routes).serialize
  end

end