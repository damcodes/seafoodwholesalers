class OrderSerializer
  def initialize(order_obj)
    @order = order_obj
  end

  def serialize 
    options = {
      include: {
        products: {
          except: [ :created_at, :updated_at ]
        }, 
        user: {
          except: [ :created_at, :updated_at, :password_digest ]
        }
      }, 
      except: [ :updated_at ]
    }
    @order.to_json(options)
  end
end
