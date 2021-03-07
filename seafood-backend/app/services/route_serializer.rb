class RouteSerializer
  def initialize(route_obj) 
    @route = route_obj
  end

  def serialize 
    options = {
      include: {
        orders: {
          
        }, 
        companies: {
          except: [ :created_at, :updated_at ]
        }
      },
      except: [ :created_at, :updated_at ]
    }
    @route.to_json(options)
  end
end
