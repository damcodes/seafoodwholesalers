class Company < ApplicationRecord
  has_many :users
  belongs_to :route

  validates :name, { uniqueness: true, presence: true }
  validates :address, { uniqueness: true, presence: true } 
  validates :route_id, { presence: true }
end
