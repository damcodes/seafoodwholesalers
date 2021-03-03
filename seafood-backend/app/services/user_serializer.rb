class UserSerializer
  def initialize(user_obj)
    @user = user_obj
  end

  def serialize 
    options = {
      include: {
        orders: {
          include: {
            products: {
              except: [ :created_at, :updated_at ]
            }
          },
          except: [ :updated_at ]
        },
        company: {
          except: [ :created_at, :updated_at ]
        }
      },
      except: [ :password_digest, :created_at, :updated_at ]
    }
    @user.to_json(options)
  end
end
