class ProductSerializer
  def initialize(product_obj)
    @product = product_obj
  end

  def serialize 
    options = {
      include: {
        orders: {
          include: {
            user: {
              except: [ :created_at, :updated_at, :password_digest ]
            }
          },
          except: [ :created_at, :updated_at ]
        }
      },
      except: [ :updated_at ]
    }
    @product.to_json(options)
  end
end