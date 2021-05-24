class CompanySerializer
  def initialize(comp_obj)
    @company = comp_obj
  end

  def serialize 
    options = {
      include: {
        users: {
          except: [:password_digest, :created_at, :updated_at]
        }
      }
    }
    @company.to_json(options)
  end
end