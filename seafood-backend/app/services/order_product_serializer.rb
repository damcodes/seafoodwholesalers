class OrderProductSerializer
  def initialize(op_obj) 
    @op = op_obj
  end

  def serialize
    options = {
      include: {
        product: {
          except: [ :created_at, :updated_at ]
        }, 
        order: {
          except: [ :created_at, :update_at ]
        }
      },
      except: [ :created_at, :updated_at ]
    }
    @op.to_json(options)
  end
end
