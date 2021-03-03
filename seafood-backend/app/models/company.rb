class Company < ApplicationRecord
  has_many :users
  belongs_to :route
end
