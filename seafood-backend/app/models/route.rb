class Route < ApplicationRecord
  has_many :orders
  has_many :companies
end
