class Company < ApplicationRecord
  has_many :users
  belongs_to :route

  validates :name, { uniqueness: true, presence: true }
  validates :address, { uniqueness: true, presence: true } 
  validates :route_id, { presence: true }
  validates :phone_number, { uniqueness: true }
end
